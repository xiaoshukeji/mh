(() => {
  const body = document.body;
  const themeSelect = document.getElementById('themeSelect');
  const searchInput = document.getElementById('searchInput');
  const tagFilters = document.getElementById('tagFilters');
  const resultCount = document.getElementById('resultCount');
  const comicGrid = document.getElementById('comicGrid');
  const mediaGalleryGrid = document.getElementById('mediaGalleryGrid');
  const mediaVideoGrid = document.getElementById('mediaVideoGrid');
  const exploreBtn = document.getElementById('exploreBtn');
  const randomBtn = document.getElementById('randomBtn');

  const readerView = document.getElementById('readerView');
  const readerHeader = document.querySelector('.reader-header');
  const readerTitle = document.getElementById('readerTitle');
  const readerMeta = document.getElementById('readerMeta');
  const readerPages = document.getElementById('readerPages');
  const closeReaderBtn = document.getElementById('closeReaderBtn');

  const state = {
    comics: [],
    filteredComics: [],
    activeTags: new Set(),
    currentEntry: null,
    media: {
      galleries: [],
      videos: [],
    },
  };

  const TAGS_MAP = {
    romance: '恋爱',
    sliceOfLife: '日常',
    adult: '成人',
    drama: '剧情',
    nurse: '护士',
    comedy: '喜剧',
    youth: '青春',
    campus: '校园',
    series: '系列',
    fantasy: '幻想',
    action: '动作',
    hero: '英雄',
    anthology: '合集',
    bonus: '番外',
    fanArt: '同人',
  };

  const comicsData = buildComicData();
  const mediaData = buildMediaData();

  let lastReaderScrollTop = 0;
  let readerHeaderHidden = false;
  const READER_SCROLL_THRESHOLD = 16;
  let videoPlaybackGuardRegistered = false;

  function buildComicData() {
    const seq = (base, count, options = {}) => {
      const { pad = 8, start = 1, ext = '.jpg' } = options;
      return Array.from({ length: count }, (_, i) => {
        const num = String(start + i).padStart(pad, '0');
        return `${base}/${num}${ext}`;
      });
    };

    const explicit = (base, names) => names.map((name) => `${base}/${name}.jpg`);

    return [
      {
        id: 'drunk-love',
        title: '因為喝醉酒而發生關係的2人',
        description: '因醉酒而拉近距离的两人，逐渐剥开隐藏的情感，与现实交织的成人恋爱故事。',
        cover: 'Resources/comic/因為喝醉酒而發生關係的2人/00000001.jpg',
        tags: [TAGS_MAP.romance, TAGS_MAP.drama, TAGS_MAP.adult],
        pages: seq('Resources/comic/因為喝醉酒而發生關係的2人', 19),
      },
      {
        id: 'rainy-leisure',
        title: '好雨配闲时',
        description: '在细雨中展开的静谧邂逅，细腻刻画人物心理，适合慢慢品味的治愈系作品。',
        cover: 'Resources/comic/好雨配闲时/00000001.jpg',
        tags: [TAGS_MAP.sliceOfLife, TAGS_MAP.romance],
        pages: seq('Resources/comic/好雨配闲时', 45),
      },
      {
        id: 'ukawa-secret',
        title: '宇川君的秘密被发现了',
        description: '当原本内敛的宇川君秘密曝光后，关系瞬间脱轨。轻松而暧昧的情节张力十足。',
        cover: 'Resources/comic/宇川君的秘密被发现了[Chinese]/00000001.jpg',
        tags: [TAGS_MAP.comedy, TAGS_MAP.romance],
        pages: seq('Resources/comic/宇川君的秘密被发现了[Chinese]', 15),
      },
      {
        id: 'part-time-student',
        title: '打工的大学生',
        description: '大学生的兼职生活远比想象中复杂，情感试探与现实压力交织，意想不到的发展随之而来。',
        cover: 'Resources/comic/打工的大学生/00000001.jpg',
        tags: [TAGS_MAP.youth, TAGS_MAP.campus, TAGS_MAP.romance],
        pages: seq('Resources/comic/打工的大学生', 31),
      },
      {
        id: 'satsuki-secret',
        title: '纱月小弟的秘密时间',
        description: '表面正经的兄妹私下竟有着另一套相处方式，暧昧与禁忌的界线不断被撕裂。',
        cover: 'Resources/comic/纱月小弟的秘密时间/00000001.jpg',
        tags: [TAGS_MAP.drama, TAGS_MAP.adult],
        pages: seq('Resources/comic/纱月小弟的秘密时间', 26),
      },
      {
        id: 'swipe-series-1',
        title: '滑动解锁阅后即干 · 第一部',
        description: '改编自互动应用的独特演出形式，通过“滑动解锁”串联情节，节奏紧凑刺激。',
        cover:
          'Resources/comic/解锁阅后即干两部全(2)/滑动解锁阅后即干1/[夢豚牧場(有馬瓶)]Swipe and play. 滑动解锁阅后即干[马栏山&桃紫汉化]/01.jpg',
        tags: [TAGS_MAP.series, TAGS_MAP.adult],
        pages: seq(
          'Resources/comic/解锁阅后即干两部全(2)/滑动解锁阅后即干1/[夢豚牧場(有馬瓶)]Swipe and play. 滑动解锁阅后即干[马栏山&桃紫汉化]',
          38,
          { pad: 2 }
        ),
      },
      {
        id: 'swipe-series-2',
        title: '滑动解锁阅后即干 · 第二部',
        description: '延续第一部的刺激互动设定，场景翻倍升级，多角色登场引发更复杂的情感纠缠。',
        cover:
          'Resources/comic/解锁阅后即干两部全(2)/_滑动解锁阅后即干2/[夢豚牧場(有馬瓶)]Swipe and play 2. 滑动解锁阅后即干2[马栏山&桃紫汉化]/0001.jpg',
        tags: [TAGS_MAP.series, TAGS_MAP.adult],
        pages: seq(
          'Resources/comic/解锁阅后即干两部全(2)/_滑动解锁阅后即干2/[夢豚牧場(有馬瓶)]Swipe and play 2. 滑动解锁阅后即干2[马栏山&桃紫汉化]',
          38,
          { pad: 4 }
        ),
      },
      {
        id: 'nurse-care',
        title: '负责照顾我的护士',
        description: '贴身照料的护士展现出意外的另一面，治愈与挑逗间的界限逐渐模糊。',
        cover: 'Resources/comic/负责照顾我的护士[Chinese]/00000001.jpg',
        tags: [TAGS_MAP.nurse, TAGS_MAP.adult],
        pages: seq('Resources/comic/负责照顾我的护士[Chinese]', 19),
      },
      {
        id: 'straight-boy-1',
        title: '青涩直男 1',
        description: '青涩少年面对突如其来的“指导课程”，情绪的波动与觉醒一触即发。',
        cover: 'Resources/comic/青涩直男1/00000001.jpg',
        tags: [TAGS_MAP.youth, TAGS_MAP.adult, TAGS_MAP.series],
        pages: explicit('Resources/comic/青涩直男1', [
          '00000001',
          '00000003',
          '00000004',
          '00000005',
          '00000006',
          '00000007',
          '00000008',
          '00000009',
          '00000010',
          '00000011',
          '00000012',
          '00000013',
          '00000015',
          '00000016',
          '00000017',
          '00000018',
          '00000019',
          '00000020',
          '00000021',
          '00000022',
          '00000023',
          '00000024',
          '00000025',
          '00000026',
          '00000027',
          '00000028',
          '00000029',
        ]),
      },
      {
        id: 'straight-boy-2',
        title: '青涩直男 2',
        description: '第二部延续“指导实验”，角色愈发放得开，故事转向更大胆的探索。',
        cover: 'Resources/comic/青涩直男2/00000001.jpg',
        tags: [TAGS_MAP.youth, TAGS_MAP.adult, TAGS_MAP.series],
        pages: seq('Resources/comic/青涩直男2', 28),
      },
      {
        id: 'straight-boy-3',
        title: '青涩直男 3',
        description: '系列终章，人物关系迎来转折与抉择，青春期的矛盾与欲望全面爆发。',
        cover: 'Resources/comic/青涩直男3/00000001.jpg',
        tags: [TAGS_MAP.youth, TAGS_MAP.adult, TAGS_MAP.series],
        pages: seq('Resources/comic/青涩直男3', 24),
      },
      {
        id: 'lymss-moon-king',
        title: '[LYMSS] 卧底英雄月王',
        description: '卧底中的月王在正义与阴谋间摇摆，都市科幻与英雄剧情紧密交织的系列开篇。',
        cover: 'Resources/comic/[LYMSS] 卧底英雄月王/1.jpg',
        tags: [TAGS_MAP.hero, TAGS_MAP.action, TAGS_MAP.series],
        pages: seq('Resources/comic/[LYMSS] 卧底英雄月王', 62, { pad: 1 }),
      },
      {
        id: 'lymss-fallen-longzhou',
        title: '[LYMSS] 堕落英雄龙宙',
        description: '龙宙在堕落与救赎之间挣扎，剧情层层反转，展现英雄内心的裂痕。',
        cover: 'Resources/comic/[LYMSS] 堕落英雄龙宙/1.jpg',
        tags: [TAGS_MAP.hero, TAGS_MAP.drama, TAGS_MAP.series],
        pages: seq('Resources/comic/[LYMSS] 堕落英雄龙宙', 46, { pad: 1 }),
      },
      {
        id: 'lymss-prologue',
        title: '[LYMSS] 堕落英雄龙宙 - 前传',
        description: '前传揭开龙宙成为英雄前的秘密，铺垫后续冲突与联盟的源起。',
        cover: 'Resources/comic/[LYMSS] 堕落英雄龙宙 - 前传/1.jpg',
        tags: [TAGS_MAP.hero, TAGS_MAP.drama, TAGS_MAP.series],
        pages: seq('Resources/comic/[LYMSS] 堕落英雄龙宙 - 前传', 62, { pad: 1 }),
      },
      {
        id: 'lymss-weekend',
        title: '[LYMSS] 月王的週末',
        description: '月王难得的周末假期，却因为突发事件再次化身英雄，轻松与紧张交错。',
        cover: 'Resources/comic/[LYMSS] 月王的週末/1.jpg',
        tags: [TAGS_MAP.hero, TAGS_MAP.sliceOfLife],
        pages: seq('Resources/comic/[LYMSS] 月王的週末', 4, { pad: 1 }),
      },
      {
        id: 'lymss-duty-room',
        title: '[LYMSS] 月王龙宙值班室',
        description: '值班室里的月王与龙宙直面城市突发状况，展现英雄团队的默契与羁绊。',
        cover: 'Resources/comic/[LYMSS] 月王龙宙值班室/1.jpg',
        tags: [TAGS_MAP.hero, TAGS_MAP.series],
        pages: seq('Resources/comic/[LYMSS] 月王龙宙值班室', 39, { pad: 1 }),
      },
      {
        id: 'lymss-gallery',
        title: 'LYMSS 杂图集',
        description: '甄选 LYMSS 系列角色彩插，角色设定与番外插画一次收藏。',
        cover: 'Resources/comic/LYMSS_-杂图/0.jpg',
        tags: [TAGS_MAP.fanArt, TAGS_MAP.anthology],
        pages: seq('Resources/comic/LYMSS_-杂图', 42, { pad: 1, start: 0 }),
      },
      {
        id: 'teenager-has-army',
        title: 'theTeenagerHasTheArmy',
        description: '少年与神秘军团的异能冒险，节奏明快且画面冲击力十足的长篇连载。',
        cover: 'Resources/comic/theTeenagerHasTheArmy/1.jpg',
        tags: [TAGS_MAP.fantasy, TAGS_MAP.action, TAGS_MAP.series],
        pages: seq('Resources/comic/theTeenagerHasTheArmy', 181, { pad: 1 }),
      },
      {
        id: 'longzhou-extra',
        title: '龙宙番外 2',
        description: '龙宙视角的温柔番外篇，补完正篇未尽的情感线，轻松暖心。',
        cover: 'Resources/comic/龙宙番外_2/0.jpg',
        tags: [TAGS_MAP.hero, TAGS_MAP.bonus],
        pages: seq('Resources/comic/龙宙番外_2', 25, { pad: 1, start: 0 }),
      },
    ];
  }

  function buildMediaData() {
    const range = (start, end) =>
      Array.from({ length: end - start + 1 }, (_, index) => start + index);
    const mapPaths = (base, files) => files.map((name) => `${base}/${name}`);

    const galleryPaths = range(2, 36).map(
      (num) => `Resources/media/a_shu图集/video (${num}).png`
    );

    const aShuVideoSources = range(1, 60).map((num) => {
      const ext = num === 1 ? '.MP4' : '.mp4';
      return `Resources/media/a_shu视频/video (${num})${ext}`;
    });

    const yanJingSources = range(1, 7).map(
      (num) => `Resources/media/yan_jing/video (${num}).mp4`
    );

    const cg3dSources = mapPaths('Resources/media/CG动画3D视频', [
      '[CG Art] Lito Perezito DaemonCollection Patreon 2018 11 November Resident Evil バイオハザード Piers Nivans x Chris Redfield 2.MP4',
      '[CG Art] Lito Perezito DaemonCollection Patreon 2018 12 December Resident Evil バイオハザード Chris Redfield x Piers Nivans 4.MP4',
      'carlos oliveira  Resident Evil.MP4',
      'free.MP4',
      'hunter dildo machine.MP4',
    ]);

    const jackStudioSources = range(1, 5).map(
      (num) => `Resources/media/JackStudio视频/${num}.mp4`
    );

    const phubSources = mapPaths('Resources/media/Phub视频', [
      'index20251111157372.mp4',
      'index20251111159593.mp4',
      'index2025111120204.mp4',
      'index2025111120515.mp4',
    ]);

    const telePremiumSources = mapPaths('Resources/media/tele付费视频', [
      '《3P之初中生、高中生、大学生》(压缩版).MP4',
      'b0b8ec06er299be32d44566c664f8034_ts.MP4',
    ]);

    return {
      galleries: [
        {
          id: 'gallery-a-shu',
          title: 'A_SHU 原创图集',
          type: 'gallery',
          description: '来自 A_SHU 的精选场景截图，35 张氛围感十足的图集资源。',
          cover: 'Resources/media/a_shu图集/video (2).png',
          tags: ['媒体', '图集'],
          pages: galleryPaths,
        },
      ],
      videos: [
        {
          id: 'video-a-shu',
          title: 'A_SHU 多段视频辑',
          type: 'video',
          description: '60 段短片集合，涵盖不同视角与场景的动态演绎，预览时默认加载首段。',
          sources: aShuVideoSources,
          tags: ['媒体', '视频'],
        },
        {
          id: 'video-yan-jing',
          title: 'Yan_Jing 精选影像',
          type: 'video',
          description: '7 段高清影像素材，可快速切换片段进行本地播放。',
          sources: yanJingSources,
          tags: ['媒体', '视频'],
        },
        {
          id: 'video-cg-3d',
          title: 'CG 动画 3D 互动集',
          type: 'video',
          description: '5 段 CG 动画短片，涵盖经典角色与原创互动场景，偏重 3D 演绎表现。',
          sources: cg3dSources,
          tags: ['媒体', '视频', '3D'],
        },
        {
          id: 'video-jack-studio',
          title: 'JackStudio 精选系列',
          type: 'video',
          description: 'JackStudio 出品的 5 段热度视频，节奏紧凑，便于快速轮播观看。',
          sources: jackStudioSources,
          tags: ['媒体', '视频'],
        },
        {
          id: 'video-phub',
          title: 'Phub 多角度合集',
          type: 'video',
          description: '4 段来自 Phub 的精选资源，文件命名保留原始索引，适合自由挑选。',
          sources: phubSources,
          tags: ['媒体', '视频'],
        },
        {
          id: 'video-tele-premium',
          title: 'Telegram 付费素材',
          type: 'video',
          description: '2 段付费渠道收集的高清素材，内容更长、更完整，适合深度观看。',
          sources: telePremiumSources,
          tags: ['媒体', '视频', '付费'],
        },
      ],
    };
  }

  function init() {
    state.comics = comicsData;
    state.media = mediaData;
    restoreTheme();
    populateTagFilters();
    applyFilters();
    renderMediaGalleries(state.media.galleries);
    renderMediaVideos(state.media.videos);
    setupGlobalVideoPlaybackGuard();
    bindEvents();
    observeCards();
  }

  function populateTagFilters() {
    const uniqueTags = [...new Set(state.comics.flatMap((comic) => comic.tags))].sort();
    const fragment = document.createDocumentFragment();
    uniqueTags.forEach((tag) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'tag-chip';
      chip.textContent = tag;
      chip.dataset.tag = tag;
      chip.dataset.active = 'false';
      fragment.appendChild(chip);
    });
    tagFilters.appendChild(fragment);
  }

  function applyFilters() {
    const keyword = searchInput.value.trim().toLowerCase();
    const activeTags = state.activeTags;

    const filtered = state.comics.filter((comic) => {
      const matchesKeyword =
        !keyword ||
        comic.title.toLowerCase().includes(keyword) ||
        comic.description.toLowerCase().includes(keyword) ||
        comic.tags.some((tag) => tag.toLowerCase().includes(keyword));

      const matchesTag =
        !activeTags.size || comic.tags.some((tag) => activeTags.has(tag));

      return matchesKeyword && matchesTag;
    });

    state.filteredComics = filtered;
    renderComicGrid(filtered);
    updateResultCount(filtered.length);
  }

  function renderComicGrid(list) {
    if (!list.length) {
      comicGrid.innerHTML =
        '<div class="empty-state">未匹配到作品，请尝试调整搜索条件。</div>';
      return;
    }

    const markup = list
      .map((comic, index) => {
        const tags = comic.tags
          .map((tag) => `<span class="tag-pill">${tag}</span>`)
          .join('');

        return `
          <article class="comic-card" data-id="${comic.id}" data-index="${index}">
            <img class="comic-cover" src="${encodeURI(comic.cover)}" alt="${comic.title} 封面" loading="lazy" />
            <div class="comic-content">
              <h3 class="comic-title">${comic.title}</h3>
              <div class="comic-meta">
                <span>${comic.pages.length} 页</span>
              </div>
              <p class="comic-desc">${comic.description}</p>
              <div class="tag-list">${tags}</div>
            </div>
          </article>
        `;
      })
      .join('');

    comicGrid.innerHTML = markup;
  }

  function renderMediaGalleries(galleries) {
    if (!mediaGalleryGrid) return;
    if (!galleries.length) {
      mediaGalleryGrid.innerHTML =
        '<div class="empty-state">暂无图集资源，稍后再来看看。</div>';
      return;
    }

    const markup = galleries
      .map((gallery) => {
        const tags = gallery.tags
          .map((tag) => `<span class="tag-pill">${tag}</span>`)
          .join('');

        return `
          <article class="media-card media-card--gallery" data-media-id="${gallery.id}">
            <img class="media-card__cover" src="${encodeURI(gallery.cover)}" alt="${gallery.title} 图集预览" loading="lazy" />
            <div class="media-card__content">
              <div class="media-card__header">
                <h3 class="media-card__title">${gallery.title}</h3>
                <span class="media-card__count">${gallery.pages.length} 张</span>
              </div>
              <p class="media-card__desc">${gallery.description}</p>
              <div class="media-card__footer">
                <div class="tag-list">${tags}</div>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    mediaGalleryGrid.innerHTML = markup;
  }

  function renderMediaVideos(videos) {
    if (!mediaVideoGrid) return;
    if (!videos.length) {
      mediaVideoGrid.innerHTML =
        '<div class="empty-state">暂无视频资源，稍后再来看看。</div>';
      return;
    }

    const markup = videos
      .map((video) => {
        const tags = video.tags
          .map((tag) => `<span class="tag-pill">${tag}</span>`)
          .join('');
        const previewSource =
          Array.isArray(video.sources) && video.sources.length ? encodeURI(video.sources[0]) : '';
        const previewMarkup = previewSource
          ? `<video class="media-card__preview" preload="metadata" muted playsinline>
              <source src="${previewSource}" type="video/mp4" />
            </video>`
          : `<div class="media-card__preview media-card__preview--placeholder">暂无预览</div>`;

        return `
          <article class="media-card media-card--video" data-media-id="${video.id}" tabindex="0" role="button" aria-label="${video.title} 视频系列">
            <div class="media-card__visual">
              ${previewMarkup}
              <div class="media-card__visual-overlay" aria-hidden="true">
                <span class="material-icon">▶</span>
              </div>
            </div>
            <div class="media-card__content">
              <div class="media-card__header">
                <h3 class="media-card__title">${video.title}</h3>
                <span class="media-card__count">${video.sources.length} 段</span>
              </div>
              <p class="media-card__desc">${video.description}</p>
              <div class="media-card__footer">
                <div class="tag-list">${tags}</div>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    mediaVideoGrid.innerHTML = markup;
  }

  function updateResultCount(count) {
    const total = state.comics.length;
    resultCount.textContent = `显示 ${count} 部 · 共 ${total} 部漫画`;
  }

  function bindEvents() {
    themeSelect.addEventListener('change', (event) => {
      applyTheme(event.target.value);
    });

    tagFilters.addEventListener('click', (event) => {
      const chip = event.target.closest('.tag-chip');
      if (!chip) return;

      const tag = chip.dataset.tag;
      if (chip.dataset.active === 'true') {
        chip.dataset.active = 'false';
        state.activeTags.delete(tag);
      } else {
        chip.dataset.active = 'true';
        state.activeTags.add(tag);
      }
      applyFilters();
    });

    searchInput.addEventListener('input', debounce(applyFilters, 150));

    comicGrid.addEventListener('click', (event) => {
      const card = event.target.closest('.comic-card');
      if (!card) return;
      const comicId = card.dataset.id;
      openViewer(comicId);
    });

    exploreBtn.addEventListener('click', () => {
      comicGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    randomBtn.addEventListener('click', () => {
      const collection = state.filteredComics.length ? state.filteredComics : state.comics;
      if (!collection.length) return;
      const randomComic = collection[Math.floor(Math.random() * collection.length)];
      const randomIndex = Math.floor(Math.random() * randomComic.pages.length);
      openViewer(randomComic.id, randomIndex);
    });

    if (mediaGalleryGrid) {
      mediaGalleryGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.media-card--gallery');
        if (!card) return;
        const mediaId = card.dataset.mediaId;
        if (!mediaId) return;
        openViewer(mediaId);
      });
    }

    if (mediaVideoGrid) {
      mediaVideoGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.media-card--video');
        if (!card) return;
        const mediaId = card.dataset.mediaId;
        if (!mediaId) return;
        openViewer(mediaId);
      });

      mediaVideoGrid.addEventListener('keydown', (event) => {
        const isActivationKey = event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar';
        if (!isActivationKey) return;
        const card = event.target.closest('.media-card--video');
        if (!card) return;
        event.preventDefault();
        const mediaId = card.dataset.mediaId;
        if (!mediaId) return;
        openViewer(mediaId);
      });
    }

    closeReaderBtn.addEventListener('click', closeReader);

    document.addEventListener('keydown', (event) => {
      if (readerView.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeReader();
      }
    });

    readerView.addEventListener('scroll', handleReaderScroll, { passive: true });
  }

  function applyTheme(theme) {
    body.dataset.theme = theme;
    localStorage.setItem('obscurax-theme', theme);
  }

  function restoreTheme() {
    const saved = localStorage.getItem('obscurax-theme');
    let theme = saved;
    if (!theme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    themeSelect.value = theme;
    applyTheme(theme);
  }

  function openViewer(entryId, pageIndex = 0) {
    const comic = state.comics.find((item) => item.id === entryId);
    const gallery = state.media.galleries.find((item) => item.id === entryId);
    const videoEntry = state.media.videos.find((item) => item.id === entryId);
    const entry = comic || gallery || videoEntry;
    if (!entry) return;

    state.currentEntry = entry;

    const isGallery = entry.type === 'gallery';
    const isVideo = entry.type === 'video';
    const unit = isVideo ? '段' : isGallery ? '张' : '页';
    const totalCount = isVideo
      ? (entry.sources ? entry.sources.length : 0)
      : entry.pages
      ? entry.pages.length
      : 0;
    const tagsLabel = entry.tags && entry.tags.length ? entry.tags.join(' / ') : '未分类';

    readerTitle.textContent = entry.title;
    readerMeta.textContent = `${totalCount} ${unit} · 标签：${tagsLabel}`;

    renderEntryContent(entry);

    readerView.hidden = false;
    readerView.setAttribute('aria-hidden', 'false');
    readerView.scrollTop = 0;
    resetReaderHeaderState();
    body.style.overflow = 'hidden';

    if (pageIndex > 0) {
      requestAnimationFrame(() => {
        const target = readerPages.querySelector(`[data-page-index='${pageIndex}']`);
        if (target) {
          target.scrollIntoView({ block: 'start' });
        }
      });
    }
  }

  function renderEntryContent(entry) {
    readerPages.innerHTML = '';
    readerPages.classList.remove('reader-pages--gallery', 'reader-pages--video');

    if (entry.type === 'video') {
      readerPages.classList.add('reader-pages--video');
      const sources = Array.isArray(entry.sources) ? entry.sources : [];
      if (!sources.length) {
        readerPages.innerHTML =
          '<div class="empty-state">该视频系列暂无片段。</div>';
        return;
      }

      const videoFragment = document.createDocumentFragment();
      sources.forEach((source, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'reader-page reader-page--video';
        wrapper.dataset.pageIndex = String(index);

        const videoElement = document.createElement('video');
        videoElement.className = 'reader-video';
        videoElement.controls = true;
        videoElement.preload = index < 2 ? 'auto' : 'metadata';
        videoElement.playsInline = true;
        videoElement.setAttribute('playsinline', '');
        videoElement.setAttribute('webkit-playsinline', '');

        const sourceElement = document.createElement('source');
        sourceElement.src = encodeURI(source);
        sourceElement.type = 'video/mp4';
        videoElement.appendChild(sourceElement);

        const caption = document.createElement('div');
        caption.className = 'reader-video__caption';
        caption.textContent = `片段 ${index + 1}`;

        wrapper.appendChild(videoElement);
        wrapper.appendChild(caption);
        videoFragment.appendChild(wrapper);
      });

      readerPages.appendChild(videoFragment);
      return;
    }

    const isGallery = entry.type === 'gallery';
    if (isGallery) {
      readerPages.classList.add('reader-pages--gallery');
    }

    const frag = document.createDocumentFragment();
    entry.pages.forEach((page, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = isGallery ? 'reader-page reader-page--gallery' : 'reader-page';
      wrapper.dataset.pageIndex = String(index);

      const img = document.createElement('img');
      img.src = encodeURI(page);
      const unit = isGallery ? '张' : '页';
      img.alt = `${entry.title} 第 ${index + 1} ${unit}`;
      img.loading = index < 3 ? 'eager' : 'lazy';

      wrapper.appendChild(img);
      frag.appendChild(wrapper);
    });
    readerPages.appendChild(frag);
  }

  function closeReader() {
    if (readerView.hidden) return;
    readerView.hidden = true;
    readerView.setAttribute('aria-hidden', 'true');
    readerPages.querySelectorAll('video').forEach((video) => {
      video.pause();
      try {
        video.currentTime = 0;
      } catch (_) {
        // Ignore if resetting currentTime is not allowed.
      }
    });
    readerPages.innerHTML = '';
    state.currentEntry = null;
    body.style.overflow = '';
    resetReaderHeaderState();
  }

  function handleReaderScroll() {
    if (readerView.hidden || !readerHeader) return;

    const current = readerView.scrollTop;
    const delta = current - lastReaderScrollTop;

    if (current <= 0) {
      showReaderHeader();
    } else if (delta > READER_SCROLL_THRESHOLD) {
      hideReaderHeader();
    } else if (delta < -READER_SCROLL_THRESHOLD) {
      showReaderHeader();
    }

    lastReaderScrollTop = current;
  }

  function hideReaderHeader() {
    if (!readerHeader || readerHeaderHidden) return;

    readerHeader.classList.add('is-hidden');
    readerHeaderHidden = true;
  }

  function showReaderHeader() {
    if (!readerHeader) {
      readerHeaderHidden = false;
      return;
    }

    if (readerHeaderHidden || readerHeader.classList.contains('is-hidden')) {
      readerHeader.classList.remove('is-hidden');
      readerHeaderHidden = false;
    }
  }

  function resetReaderHeaderState() {
    if (readerHeader) {
      readerHeader.classList.remove('is-hidden');
    }
    readerHeaderHidden = false;
    lastReaderScrollTop = readerView ? readerView.scrollTop : 0;
  }

  function setupGlobalVideoPlaybackGuard() {
    if (videoPlaybackGuardRegistered) return;
    if (typeof HTMLVideoElement === 'undefined') return;

    document.addEventListener(
      'play',
      (event) => {
        const target = event.target;
        if (!(target instanceof HTMLVideoElement)) return;
        document.querySelectorAll('video').forEach((video) => {
          if (video !== target && !video.paused) {
            video.pause();
          }
        });
      },
      true
    );

    videoPlaybackGuardRegistered = true;
  }

  function debounce(fn, delay = 200) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(null, args), delay);
    };
  }

  function observeCards() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.visible = 'true';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    const watchCards = () => {
      document
        .querySelectorAll('.comic-card, .media-card')
        .forEach((card) => observer.observe(card));
    };

    const gridObserver = new MutationObserver(() => watchCards());
    [comicGrid, mediaGalleryGrid, mediaVideoGrid]
      .filter(Boolean)
      .forEach((target) => gridObserver.observe(target, { childList: true }));
    watchCards();
  }

  window.addEventListener('DOMContentLoaded', init);
})();

