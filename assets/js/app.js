const sidebar = document.querySelector('#sidebar');
const menuToggle = document.querySelector('.menu-toggle');
const articleCard = document.querySelector('.article-card');
const articleHeader = document.querySelector('#article-header');
const articleBody = document.querySelector('#article-body');
const status = document.querySelector('#status');
const navigation = document.querySelector('#article-navigation');
const homePanel = document.querySelector('#home-panel');
const homeLink = document.querySelector('.home-link');
const resumePanel = document.querySelector('#resume-panel');
const aboutLink = document.querySelector('.about-link');
const tagsPanel = document.querySelector('#tags-panel');
const tagsLink = document.querySelector('.tags-link');
const seriesPanel = document.querySelector('#series-panel');
const seriesLink = document.querySelector('.series-link');
const archivesPanel = document.querySelector('#archives-panel');
const archivesLink = document.querySelector('.archives-link');
// Đo chiều cao thực để sidebar luôn nằm dưới thanh series, kể cả khi tên dài xuống dòng.
const readingToolbar = document.querySelector('#reading-toolbar');
const toolbarObserver = new ResizeObserver(() => {
  const height = readingToolbar.getBoundingClientRect().height;
  if (height > 0) document.documentElement.style.setProperty('--reading-toolbar-height', `${height}px`);
});
toolbarObserver.observe(readingToolbar);
// Cuộn tới danh sách mà không biến liên kết trong trang thành route bài viết.
document.querySelector('#browse-posts').addEventListener('click', (event) => {
  event.preventDefault();
  const heading = document.querySelector('#latest-posts');
  heading.focus({ preventScroll: true });
  heading.scrollIntoView({ block: 'start' });
});
let catalog;
let renderVersion = 0;
let displayedPostId = null;
let pageAnimation = null;

function cancelPageAnimation() {
  pageAnimation?.cancel();
  pageAnimation = null;
}

function slideDirection(series, id) {
  const previous = series?.postIds.indexOf(displayedPostId) ?? -1;
  const next = series?.postIds.indexOf(id) ?? -1;
  return previous >= 0 && next >= 0 ? Math.sign(next - previous) : 0;
}

async function animatePage(direction, entering) {
  if (!direction || !articleCard.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const offscreen = { transform: `translateX(${(entering ? direction : -direction) * 15}%)`, opacity: 0 };
  const resting = { transform: 'translateX(0)', opacity: 1 };
  const animation = articleCard.animate(entering ? [offscreen, resting] : [resting, offscreen], {
    duration: 200, easing: 'cubic-bezier(.22,.61,.36,1)',
  });
  pageAnimation = animation;
  try { await animation.finished; }
  catch { /* Đổi route trong lúc trượt thì bỏ hiệu ứng đang chạy. */ }
  finally { if (pageAnimation === animation) pageAnimation = null; }
}

document.addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || event.defaultPrevented || event.repeat
    || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
    || articleCard.hidden || navigation.hidden || articleCard.getAttribute('aria-busy') === 'true') return;
  // Không chiếm phím khi nhập liệu, thao tác điều khiển hoặc cuộn ngang đoạn code.
  if (event.target.closest('input, textarea, select, button, [contenteditable]:not([contenteditable="false"]), pre, [role="textbox"]')
    || window.getSelection()?.toString()) return;
  const link = document.querySelector(event.key === 'ArrowRight' ? '#next-post' : '#previous-post');
  if (link.hidden || !link.hasAttribute('href')) return;
  event.preventDefault();
  window.location.hash = link.hash;
});

// Ứng dụng đưa người đọc lên đầu mỗi bài, kể cả khi dùng Back/Forward.
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

// Liên kết bỏ qua sidebar chỉ chuyển focus, không thay đổi route của bài viết.
document.querySelector('.skip-link').addEventListener('click', (event) => {
  event.preventDefault();
  const main = document.querySelector('#main-content');
  main.focus();
  main.scrollIntoView();
});

menuToggle.addEventListener('click', () => {
  const open = sidebar.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

sidebar.addEventListener('click', (event) => {
  // Đóng menu cả khi người đọc chọn lại bài đang mở (hash không thay đổi).
  const link = event.target.closest('.post-link');
  if (!link) return;
  sidebar.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  // Giữ hành vi mở tab mới; click thông thường vào bài hiện tại sẽ tải lại bài.
  if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey
    && link.hash === window.location.hash) {
    event.preventDefault();
    renderPost();
  }
});

async function loadFile(path, json = false) {
  // Kiểm tra bản mới trên server khi tải bài/danh mục, vẫn tận dụng cache nếu không đổi.
  const response = await fetch(new URL(path, document.baseURI), { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Không tải được ${path}`);
  return json ? response.json() : response.text();
}

function postUrl(id) {
  return `#/posts/${encodeURIComponent(id)}`;
}

function getPostId() {
  const route = window.location.hash;
  const match = route.match(/^#\/posts\/([^/]+)$/);
  if (!match) throw new Error('Đường dẫn bài viết không hợp lệ. Hãy chọn một bài trong danh sách.');
  try {
    return decodeURIComponent(match[1]);
  } catch {
    throw new Error('Đường dẫn bài viết không hợp lệ. Hãy chọn một bài trong danh sách.');
  }
}

function setActivePost(id) {
  document.querySelectorAll('.post-link').forEach((link) => {
    if (link.dataset.postId === id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function formatDate(value) {
  return new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })
    .format(new Date(`${value}T00:00:00`));
}

function tagUrl(tag) {
  return `#/tags/${encodeURIComponent(tag)}`;
}

function createTagLink(tag) {
  const link = document.createElement('a');
  link.className = 'tag';
  link.href = tagUrl(tag);
  link.textContent = tag;
  return link;
}

function buildHome() {
  document.querySelector('#post-count').textContent = `${catalog.posts.length} bài viết`;
  buildPostGrid(document.querySelector('#post-grid'), catalog.posts);
}

function buildPostGrid(grid, items) {
  grid.replaceChildren();
  // Sao chép trước khi sắp xếp để giữ thứ tự bài trong danh mục và series.
  const posts = [...items].sort((a, b) => b.date.localeCompare(a.date));
  if (!posts.length) {
    grid.textContent = 'Chưa có bài viết. Hẹn bạn ở những ghi chú sắp tới!';
    return;
  }
  posts.forEach((post) => {
    // Dùng article để liên kết tag không bị lồng trong liên kết bài viết.
    const card = document.createElement('article');
    card.className = 'post-card';
    card.dataset.postId = post.id;
    const cover = document.createElement('img');
    cover.className = 'post-cover';
    cover.src = post.cover || 'assets/images/covers/javascript-start.svg';
    cover.alt = '';
    cover.width = 960;
    cover.height = 540;
    cover.loading = 'lazy';
    cover.decoding = 'async';
    cover.addEventListener('error', () => {
      cover.src = 'assets/images/covers/javascript-start.svg';
    }, { once: true });
    const body = document.createElement('div');
    body.className = 'post-card-body';
    const meta = document.createElement('div');
    meta.className = 'post-card-meta';
    const series = catalog.series.find((item) => item.postIds.includes(post.id));
    const category = document.createElement('span');
    category.textContent = series?.title || 'Bài viết';
    const date = document.createElement('time');
    date.dateTime = post.date;
    date.textContent = formatDate(post.date);
    meta.append(category, date);
    const title = document.createElement('h3');
    const titleLink = document.createElement('a');
    titleLink.className = 'post-title-link';
    titleLink.href = postUrl(post.id);
    titleLink.textContent = post.title;
    title.append(titleLink);
    const excerpt = document.createElement('p');
    excerpt.className = 'post-excerpt';
    excerpt.textContent = post.excerpt || 'Đọc bài viết và cùng khám phá những ghi chú học tập.';
    const tags = document.createElement('div');
    tags.className = 'tags';
    post.tags.forEach((value) => tags.append(createTagLink(value)));
    const read = document.createElement('a');
    read.className = 'post-read-link';
    read.href = postUrl(post.id);
    read.textContent = 'Đọc bài viết →';
    body.append(meta, title, excerpt, tags, read);
    card.append(cover, body);
    grid.append(card);
  });
}

function renderTags() {
  const cloud = document.querySelector('#tag-cloud');
  cloud.replaceChildren();
  const counts = new Map();
  // Mỗi bài chỉ được đếm một lần cho một tag, kể cả metadata bị lặp tag.
  catalog.posts.forEach((post) => new Set(post.tags).forEach((tag) => {
    counts.set(tag, (counts.get(tag) || 0) + 1);
  }));
  let selected = null;
  if (window.location.hash !== '#/tags') {
    try { selected = decodeURIComponent(window.location.hash.slice('#/tags/'.length)); }
    catch { selected = ''; }
  }
  document.querySelector('#tag-count').textContent = `${counts.size} tags`;
  [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'vi')).forEach(([tag, count]) => {
    const link = createTagLink(tag);
    link.className = 'tag-pill';
    if (count > 1) link.classList.add('is-popular');
    if (selected === tag) link.setAttribute('aria-current', 'page');
    link.setAttribute('aria-label', `${tag}: ${count} bài viết`);
    const badge = document.createElement('span');
    badge.className = 'tag-pill-count';
    badge.textContent = count;
    badge.setAttribute('aria-hidden', 'true');
    link.append(badge);
    cloud.append(link);
  });
  if (!counts.size) cloud.textContent = 'Tags sẽ xuất hiện khi có bài viết mới.';
  const posts = catalog.posts.filter((post) => post.tags.includes(selected));
  document.querySelector('#tag-results').hidden = selected === null;
  document.querySelector('#tag-results-title').textContent = `${selected || 'Tag không hợp lệ'} · ${posts.length} bài viết`;
  document.querySelector('#tag-empty').hidden = posts.length > 0;
  const grid = document.querySelector('#tag-post-grid');
  if (posts.length) buildPostGrid(grid, posts);
  else grid.replaceChildren();
  document.title = `${selected ? `Tag: ${selected}` : 'Tags'} — Blog của Cốt Dừa`;
}

function seriesUrl(id) {
  return `#/series/${encodeURIComponent(id)}`;
}

function seriesPosts(series) {
  // Giữ thứ tự tác giả chọn trong postIds, bỏ qua ID chưa có bài tương ứng.
  return series.postIds.map((id) => catalog.posts.find((post) => post.id === id)).filter(Boolean);
}

function renderSeries() {
  const grid = document.querySelector('#collection-grid');
  const detail = document.querySelector('#collection-detail');
  const heading = document.querySelector('#collections-title');
  const description = document.querySelector('#collections-description');
  const count = document.querySelector('#series-count');
  const list = document.querySelector('#collection-posts');
  const empty = document.querySelector('#collection-empty');
  const start = document.querySelector('#start-series');
  const types = { course: 'Khóa học', book: 'Sách', topic: 'Chủ đề' };
  const isIndex = window.location.hash === '#/series';
  grid.hidden = !isIndex;
  detail.hidden = isIndex;
  grid.replaceChildren();
  list.replaceChildren();
  start.hidden = true;
  start.removeAttribute('href');
  empty.hidden = true;
  if (isIndex) {
    heading.textContent = 'Series';
    count.textContent = `${catalog.series.length} series`;
    description.textContent = 'Những bài viết mình gom lại theo khóa học, cuốn sách hoặc một chủ đề. Chọn một series để đọc từ đầu và theo dõi mạch nội dung.';
    document.title = 'Series — Blog của Cốt Dừa';
    catalog.series.forEach((series) => {
      const posts = seriesPosts(series);
      const card = document.createElement('a');
      card.className = 'collection-card';
      card.href = seriesUrl(series.id);
      const meta = document.createElement('span');
      meta.className = 'collection-meta';
      meta.textContent = `${types[series.type] || 'Chủ đề'} · ${posts.length} bài viết`;
      const title = document.createElement('h2');
      title.textContent = series.title;
      const summary = document.createElement('p');
      summary.textContent = series.description || 'Các bài viết cùng chủ đề, được sắp xếp theo thứ tự đọc.';
      const action = document.createElement('span');
      action.className = 'collection-action';
      action.textContent = 'Xem series →';
      card.append(meta, title, summary, action);
      grid.append(card);
    });
    if (!catalog.series.length) grid.textContent = 'Chưa có series. Hẹn bạn ở những bài viết sắp tới!';
    return;
  }
  let id;
  try { id = decodeURIComponent(window.location.hash.slice('#/series/'.length)); }
  catch { id = null; }
  const series = catalog.series.find((item) => item.id === id);
  const posts = series ? seriesPosts(series) : [];
  heading.textContent = series?.title || 'Không tìm thấy series';
  count.textContent = `${posts.length} bài viết`;
  description.textContent = series ? `${types[series.type] || 'Chủ đề'} — ${series.description || 'Đọc các bài theo thứ tự dưới đây.'}` : 'Bạn có thể quay lại danh sách để chọn một series khác.';
  document.title = `${heading.textContent} — Blog của Cốt Dừa`;
  if (!posts.length) {
    empty.hidden = false;
    empty.textContent = series ? 'Series này chưa có bài viết. Bạn ghé lại sau nhé.' : 'Series này không tồn tại hoặc đường dẫn chưa đúng.';
    return;
  }
  start.hidden = false;
  start.href = postUrl(posts[0].id);
  posts.forEach((post, index) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'collection-post';
    link.href = postUrl(post.id);
    const number = document.createElement('span');
    number.className = 'post-number';
    number.textContent = index + 1;
    number.setAttribute('aria-hidden', 'true');
    const body = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = post.title;
    const date = document.createElement('time');
    date.dateTime = post.date;
    date.textContent = formatDate(post.date);
    const excerpt = document.createElement('p');
    excerpt.textContent = post.excerpt || 'Mở bài để đọc nội dung chi tiết.';
    body.append(title, date, excerpt);
    link.append(number, body);
    item.append(link);
    list.append(item);
  });
}

function renderArchives() {
  const timeline = document.querySelector('#archive-timeline');
  timeline.replaceChildren();
  const posts = [...catalog.posts].sort((a, b) => b.date.localeCompare(a.date));
  document.querySelector('#archives-count').textContent = `${posts.length} bài viết`;
  document.querySelector('#archives-empty').hidden = posts.length > 0;
  // Gom theo ngày đăng trong metadata; không đổi thứ tự bài của từng series.
  const years = new Map();
  posts.forEach((post) => {
    const [year, month] = post.date.split('-');
    if (!years.has(year)) years.set(year, new Map());
    const months = years.get(year);
    if (!months.has(month)) months.set(month, []);
    months.get(month).push(post);
  });
  years.forEach((months, year) => {
    const section = document.createElement('section');
    section.className = 'archive-year';
    const heading = document.createElement('h2');
    heading.className = 'archive-year-label';
    heading.id = `archive-year-${year}`;
    heading.textContent = year;
    section.setAttribute('aria-labelledby', heading.id);
    section.append(heading);
    months.forEach((items, month) => {
      const group = document.createElement('section');
      group.className = 'archive-month';
      const title = document.createElement('h3');
      title.id = `archive-month-${year}-${month}`;
      title.textContent = `Tháng ${Number(month)}`;
      group.setAttribute('aria-labelledby', title.id);
      const count = document.createElement('span');
      count.className = 'archive-month-count';
      count.textContent = `${items.length} bài`;
      title.append(count);
      const list = document.createElement('ul');
      list.className = 'archive-posts';
      items.forEach((post) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'archive-post';
        link.href = postUrl(post.id);
        const date = document.createElement('time');
        date.dateTime = post.date;
        date.textContent = formatDate(post.date);
        const name = document.createElement('h4');
        name.textContent = post.title;
        const excerpt = document.createElement('p');
        excerpt.textContent = post.excerpt || 'Mở bài viết để đọc những điều mình muốn chia sẻ.';
        link.append(date, name, excerpt);
        item.append(link);
        list.append(item);
      });
      group.append(title, list);
      section.append(group);
    });
    timeline.append(section);
  });
  document.title = 'Hành trình viết bài — Blog của Cốt Dừa';
}

function renderRoute() {
  if (!catalog) return;
  const isHome = ['', '#/', '#/home'].includes(window.location.hash);
  const isAbout = window.location.hash === '#/about';
  const isTags = window.location.hash === '#/tags' || window.location.hash.startsWith('#/tags/');
  const isSeries = window.location.hash === '#/series' || window.location.hash.startsWith('#/series/');
  const isArchives = window.location.hash === '#/archives';
  const isPage = isHome || isAbout || isTags || isSeries || isArchives;
  document.querySelector('.topbar').hidden = !isPage;
  document.body.classList.toggle('home-view', isPage);
  homePanel.hidden = !isHome;
  resumePanel.hidden = !isAbout;
  tagsPanel.hidden = !isTags;
  seriesPanel.hidden = !isSeries;
  archivesPanel.hidden = !isArchives;
  articleCard.hidden = isPage;
  document.querySelector('#reading-toolbar').hidden = isPage;
  document.querySelector('.reading-note').hidden = isPage;
  homeLink.removeAttribute('aria-current');
  aboutLink.removeAttribute('aria-current');
  tagsLink.removeAttribute('aria-current');
  seriesLink.removeAttribute('aria-current');
  archivesLink.removeAttribute('aria-current');
  sidebar.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  if (isPage) {
    // Hủy hiệu lực bài đang tải để nó không cập nhật lại giao diện sau khi về home.
    ++renderVersion;
    cancelPageAnimation();
    displayedPostId = null;
    setActivePost(null);
    (isHome ? homeLink : isAbout ? aboutLink : isSeries ? seriesLink : isArchives ? archivesLink : tagsLink).setAttribute('aria-current', 'page');
    document.title = isAbout ? 'About me — Blog của Cốt Dừa' : 'Blog của Cốt Dừa — Kiến thức, trải nghiệm & cảm nghĩ';
    document.querySelector('.skip-link').textContent = isAbout ? 'Đến hồ sơ cá nhân' : 'Đến danh sách bài viết';
    if (isTags) {
      renderTags();
      document.querySelector('.skip-link').textContent = 'Đến danh sách tags';
    }
    if (isSeries) {
      renderSeries();
      document.querySelector('.skip-link').textContent = 'Đến nội dung series';
    }
    if (isArchives) {
      renderArchives();
      document.querySelector('.skip-link').textContent = 'Đến hành trình viết bài';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  } else {
    homeLink.removeAttribute('aria-current');
    document.querySelector('.skip-link').textContent = 'Đến nội dung bài viết';
    return renderPost();
  }
}

function buildSidebar(currentSeries) {
  const container = document.querySelector('#series-list');
  container.replaceChildren();
  // Sidebar theo bài đang đọc, không trộn các series khác vào cùng danh sách.
  document.querySelector('#series-title').textContent = currentSeries?.title || 'Quay lại Series';
  document.querySelector('#reading-exit').setAttribute('aria-label', currentSeries
    ? `Thoát đọc ${currentSeries.title}, quay lại trang Series`
    : 'Quay lại trang Series');
  if (!currentSeries) return;
  for (const series of [currentSeries]) {
    const heading = document.createElement('h3');
    heading.className = 'series-heading';
    heading.textContent = series.title;
    const list = document.createElement('ol');
    list.className = 'post-list';

    series.postIds.forEach((id, index) => {
      const post = catalog.posts.find((item) => item.id === id);
      if (!post) return;
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.className = 'post-link';
      link.href = postUrl(id);
      link.dataset.postId = id;
      const number = document.createElement('span');
      number.className = 'post-number';
      number.textContent = index + 1;
      const title = document.createElement('span');
      title.textContent = post.title;
      link.append(number, title);
      item.append(link);
      list.append(item);
    });
    container.append(heading, list);
  }
}

function showError(message) {
  cancelPageAnimation();
  displayedPostId = null;
  document.title = 'Không tải được bài viết — Blog của Cốt Dừa';
  articleHeader.hidden = true;
  navigation.hidden = true;
  articleBody.replaceChildren();
  status.textContent = message;
  const retry = document.createElement('a');
  retry.href = window.location.href;
  retry.textContent = 'Thử lại';
  retry.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.reload();
  });
  status.append(retry);
  status.hidden = false;
  articleCard.setAttribute('aria-busy', 'false');
}

function setNavigation(series, id) {
  const postIds = series?.postIds || [];
  const position = postIds.indexOf(id);
  let hasNeighbor = false;
  for (const [selector, offset, label] of [
    ['#previous-post', -1, '← Bài trước'],
    ['#next-post', 1, 'Bài tiếp theo →'],
  ]) {
    const link = document.querySelector(selector);
    const neighborId = position >= 0 ? postIds[position + offset] : undefined;
    const post = catalog.posts.find((item) => item.id === neighborId);
    link.hidden = !post;
    link.removeAttribute('href');
    link.removeAttribute('aria-label');
    link.textContent = '';
    if (post) {
      hasNeighbor = true;
      link.href = postUrl(post.id);
      link.textContent = label;
      link.setAttribute('aria-label', `${label}: ${post.title}`);
    }
  }
  navigation.hidden = !hasNeighbor;
}

function addCopyButtons() {
  articleBody.querySelectorAll('pre > code').forEach((code) => {
    const pre = code.parentElement;
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-code';
    button.title = 'Sao chép đoạn code';
    button.setAttribute('aria-label', 'Sao chép đoạn code');
    const icon = document.createElement('span');
    icon.className = 'copy-icon';
    icon.setAttribute('aria-hidden', 'true');
    button.append(icon);
    const feedback = document.createElement('span');
    feedback.className = 'copy-feedback';
    feedback.setAttribute('role', 'status');
    pre.replaceWith(wrapper);
    wrapper.append(pre, feedback, button);
    let feedbackTimer;

    button.addEventListener('click', async () => {
      button.disabled = true;
      clearTimeout(feedbackTimer);
      try {
        // Chỉ sao chép nội dung code để giữ xuống dòng và thụt lề, không lấy nhãn nút.
        await navigator.clipboard.writeText(code.textContent);
        feedback.textContent = 'Đã sao chép';
      } catch {
        feedback.textContent = 'Chưa sao chép được. Hãy thử lại.';
      } finally {
        button.disabled = false;
        feedbackTimer = setTimeout(() => { feedback.textContent = ''; }, 3000);
      }
    });
  });
}

function highlightCode() {
  // Chỉ tô màu ngôn ngữ được khai báo trong Markdown; CDN lỗi vẫn đọc/copy code được.
  if (!window.hljs) return;
  articleBody.querySelectorAll('pre > code').forEach((code) => {
    const language = [...code.classList].find((name) => name.startsWith('language-'))?.slice(9);
    if (!language || !hljs.getLanguage(language)) return;
    hljs.highlightElement(code);
  });
}

async function renderPost() {
  if (!catalog) return;
  // Bỏ kết quả tải cũ nếu người đọc chọn bài khác trước khi fetch hoàn tất.
  const currentVersion = ++renderVersion;
  cancelPageAnimation();
  let id;
  try {
    id = getPostId();
  } catch (error) {
    buildSidebar();
    setActivePost(null);
    showError(error.message);
    return;
  }
  const post = catalog.posts.find((item) => item.id === id);
  const series = catalog.series.find((item) => item.postIds.includes(id));
  const direction = slideDirection(series, id);
  buildSidebar(post ? series : undefined);
  setActivePost(post?.id);
  if (!post) {
    showError('Không tìm thấy bài viết. Hãy chọn một bài trong danh sách.');
    return;
  }

  const hasCurrentArticle = displayedPostId !== null && !articleHeader.hidden;
  if (!hasCurrentArticle) {
    articleHeader.hidden = true;
    navigation.hidden = true;
    articleBody.replaceChildren();
  }
  status.textContent = 'Đang tải bài viết…';
  status.hidden = hasCurrentArticle;
  articleCard.setAttribute('aria-busy', 'true');

  try {
    if (!window.marked || !window.DOMPurify) throw new Error('Thư viện CDN chưa tải được');
    const markdown = await loadFile(post.path);
    if (currentVersion !== renderVersion) return;

    // Làm sạch HTML trước khi đưa nội dung Markdown vào trang.
    const html = DOMPurify.sanitize(marked.parse(markdown), { USE_PROFILES: { html: true } });
    await animatePage(direction, false);
    if (currentVersion !== renderVersion) return;
    articleBody.innerHTML = html;
    const firstHeading = articleBody.firstElementChild;
    if (firstHeading?.tagName === 'H1' && firstHeading.textContent.trim() === post.title) firstHeading.remove();
    highlightCode();
    addCopyButtons();

    // Ảnh đứng riêng được đặt trong figure; title Markdown trở thành chú thích.
    articleBody.querySelectorAll('p > img:only-child').forEach((image) => {
      const paragraph = image.parentElement;
      if (paragraph.textContent.trim()) return;
      const figure = document.createElement('figure');
      figure.className = 'article-figure';
      image.loading = 'lazy';
      image.decoding = 'async';
      paragraph.replaceWith(figure);
      figure.append(image);
      if (image.title) {
        const caption = document.createElement('figcaption');
        caption.textContent = image.title;
        image.removeAttribute('title');
        figure.append(caption);
      }
    });

    // Hiển thị nhãn ghi chú đơn giản; phần trình bày nâng cao sẽ làm ở phase sau.
    articleBody.querySelectorAll('blockquote > p:first-child').forEach((paragraph) => {
      const firstNode = paragraph.firstChild;
      if (firstNode?.nodeType !== Node.TEXT_NODE || !firstNode.textContent.startsWith('[!NOTE]')) return;
      firstNode.textContent = firstNode.textContent.replace(/^\[!NOTE\]\s*/, '');
      const label = document.createElement('strong');
      label.className = 'callout-label';
      label.textContent = 'Ghi chú kinh nghiệm';
      paragraph.before(label);
    });

    document.querySelector('#article-title').textContent = post.title;
    const date = document.querySelector('#article-date');
    date.dateTime = post.date;
    date.textContent = formatDate(post.date);
    const wordCount = articleBody.textContent.trim().split(/\s+/).length;
    document.querySelector('#reading-time').textContent = `${Math.max(1, Math.ceil(wordCount / 220))} phút đọc`;
    const tags = document.querySelector('#article-tags');
    tags.replaceChildren();
    post.tags.forEach((tag) => tags.append(createTagLink(tag)));
    setNavigation(series, id);
    document.title = `${post.title} — Blog của Cốt Dừa`;
    articleHeader.hidden = false;
    status.hidden = true;
    sidebar.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    displayedPostId = id;
    await animatePage(direction, true);
  } catch {
    if (currentVersion === renderVersion) showError('Chưa tải được bài viết. Hãy kiểm tra kết nối mạng và thử lại.');
  } finally {
    if (currentVersion === renderVersion) articleCard.setAttribute('aria-busy', 'false');
  }
}

window.addEventListener('hashchange', renderRoute);

async function init() {
  try {
    catalog = await loadFile('content/index.json', true);
    buildSidebar();
    buildHome();
    await renderRoute();
  } catch {
    showError('Chưa tải được danh sách bài. Hãy mở website qua HTTP thay vì mở trực tiếp file HTML.');
  }
}

init();
