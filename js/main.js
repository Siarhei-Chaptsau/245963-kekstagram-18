'use strict';

var pictures = [];
var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var COMMENTATORS_NAMES = ['Миша', 'Глеб', 'Паша', 'юра', 'Фома', 'Феофан', 'эрик', 'Нагибатор_3000'];

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var locationOfPicture = document.querySelector('.pictures'); // куда вставим фото
var templateOfPicture = document.querySelector('#picture').content.querySelector('.picture'); // образец

for (var i = 1; i < 26; i++) {
  var picture = {
    url: 'photos/' + i + '.jpg',
    description: 'photos/' + i + '.jpg',
    likes: getRandomIntInclusive(15, 200),
    comments: [{
      avatar: 'img/avatar-' + getRandomIntInclusive(1, 6) + '.svg',
      message: COMMENTS[getRandomIntInclusive(0, COMMENTS.length - 1)],
      name: COMMENTATORS_NAMES[getRandomIntInclusive(0, COMMENTATORS_NAMES.length - 1)]
    }]
  };
  pictures.push(picture);
}

var renderPicture = function (item) {
  var pictureElement = templateOfPicture.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = item.url;
  pictureElement.querySelector('.picture__img').alt = item.url;
  pictureElement.querySelector('.picture__comments').textContent = item.comments[0].name;
  pictureElement.querySelector('.picture__likes').textContent = item.likes;

  return pictureElement;
};

var fragment = document.createDocumentFragment();
for (var j = 0; j < pictures.length; j++) {
  fragment.appendChild(renderPicture(pictures[j]));
}
locationOfPicture.appendChild(fragment);
