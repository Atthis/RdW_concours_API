const articlesContainer = document.querySelector('.grid-container');
const articlesLoader = document.querySelector('.articles-loader');
const filterSystem = document.querySelector('.filter-elements');
const form = document.querySelector('.filter-elements');
const selectedSourcesContainer = document.querySelector(
  '.selected-sources-container'
);

const displayedArticleNbr = 20;
let articleIncrement = 0;
let articlesArray = [];

const articleFetch = async pageNbr => {
  try {
    const articles = await fetch(
      `https://api.spaceflightnewsapi.net/v3/articles?_limit=${displayedArticleNbr}&_start=${pageNbr}`
    );

    const data = await articles.json();

    return data;
  } catch (error) {
    console.warn(error);
  }
};

function createDOMArticle(article, fragment) {
  const articleContainer = document.createElement('article');

  articleContainer.className = 'article';

  const publishedDate = `${article.publishedAt.slice(
    8,
    10
  )}/${article.publishedAt.slice(5, 7)}/${article.publishedAt.slice(0, 4)}`;

  articleContainer.innerHTML = `
              <section class="article-img-container">
                  <img src="${article.imageUrl}" alt="" class="article-image">
                  </section>
                  <section class="article-infos">
                      <h1 class="article-title"><a href="${article.url}" target="_blank">${article.title}</a></h1>
                      <div class="article-data">
                          <p class="article-date">${publishedDate}</p>
                          <p class="article-source">${article.newsSite}</p>
                      </div>
                      <p class="article-sum">${article.summary}</p>
                  </section>
                  <section >
                  </section>
    `;

  // Add summary display on click
  // articleContainer.addEventListener('click', function () {

  //   this.classList.toggle('spread-article');
  //   console.dir(this);
  // });

  fragment.appendChild(articleContainer);
}

function displayArticles(data, fragment) {
  data.forEach(article => createDOMArticle(article, fragment));

  articlesContainer.append(fragment);
}

const newsSitesFetch = async () => {
  try {
    const APIInfo = await fetch('https://api.spaceflightnewsapi.net/v3/info');

    const APIInfoData = await APIInfo.json();

    const newsSites = APIInfoData.newsSites;

    return newsSites;
  } catch (error) {
    console.warn(error);
  }
};

function appendSelectOptions(options, fragment) {
  options.forEach(site => {
    const option = document.createElement('option');
    option.value = site;
    option.innerText = site;
    option.className = 'news-site';
    fragment.appendChild(option);
  });
  form.newsSources.append(fragment);
}

const intersectionObsOptions = {
  threshold: 1.0,
};

let isFirstDisplay = true;
const optionsFragment = document.createDocumentFragment();
const articlesFragment = document.createDocumentFragment();

const intersectObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      articleFetch(articleIncrement).then(data => {
        articlesArray.push(...data);

        if (isFirstDisplay) {
          setTimeout(() => {
            displayArticles(data, articlesFragment);
            filterSystem.classList.remove('isHidden');
          }, 1500);
          isFirstDisplay = false;
          return;
        }

        displayArticles(data, articlesFragment);
      });
      articleIncrement += displayedArticleNbr;
    }
  });
}, intersectionObsOptions);

newsSitesFetch().then(sources => {
  appendSelectOptions(sources, optionsFragment);
});

setTimeout(() => articlesLoader.classList.remove('isHidden'), 1500);

intersectObserver.observe(articlesLoader);

form.newsSources.addEventListener('input', function (e) {
  e.preventDefault();

  if (this.value === 'all-sources') {
    selectedSourcesContainer.innerHTML = '';

    document
      .querySelectorAll('.news-sources option')
      .forEach(option => option.classList.remove('isActive'));

    articlesContainer.innerHTML = '';
    displayArticles(articlesArray, articlesFragment);

    articlesLoader.classList.remove('isHidden');

    form.newsSources.blur();

    return;
  }
  articlesLoader.classList.add('isHidden');

  articlesContainer.innerHTML = '';

  articlesArray.forEach(article => {
    if (article.newsSite !== this.value) return;

    createDOMArticle(article, articlesFragment);
  });

  articlesContainer.append(articlesFragment);

  form.newsSources.blur();

  document
    .querySelector(`option[value='${this.value}']`)
    .classList.add('isActive');
});
