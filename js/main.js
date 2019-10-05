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
var COMMENTATORS_NAMES = ['Миша', 'Глеб', 'Паша', 'юра', 'Фома', 'Феофан', 'эрик', 'Нагибатор'];
var MIN_COMMENTS = 1;
var MAX_COMMENTS = 6;

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var makeElement = function (tagName, className, text) {
  var element = document.createElement(tagName);

  element.classList.add(className);
  if (text) {
    element.textContent = text;
  }
  return element;
};

var locationOfPicture = document.querySelector('.pictures'); // куда вставим фото
var templateOfPicture = document.querySelector('#picture').content.querySelector('.picture'); // образец

// Функция, получающая массив объектов-комментариев к фото
var getComments = function () {
  var messageArray = [];

  for (var k = 0; k < getRandomIntInclusive(MIN_COMMENTS, MAX_COMMENTS); k++) {
    var messageItem = {
      avatar: 'img/avatar-' + getRandomIntInclusive(1, 6) + '.svg',
      message: COMMENTS[getRandomIntInclusive(0, COMMENTS.length - 1)],
      name: COMMENTATORS_NAMES[getRandomIntInclusive(0, COMMENTATORS_NAMES.length - 1)]
    };
    messageArray.push(messageItem);
  }
  return messageArray;
};

// получение 25 объектов
for (var i = 1; i < 26; i++) {
  var picture = {
    url: 'photos/' + i + '.jpg',
    description: 'photos/' + i + '.jpg',
    likes: getRandomIntInclusive(15, 200),
    comments: getComments()
  };
  pictures.push(picture);
}

// создания DOM-элемента на основе JS-объекта
var renderPicture = function (item) {
  var pictureElement = templateOfPicture.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = item.url;
  pictureElement.querySelector('.picture__img').alt = item.url;
  pictureElement.querySelector('.picture__comments').textContent = item.comments.length;
  pictureElement.querySelector('.picture__likes').textContent = item.likes;

  return pictureElement;
};

var fragment = document.createDocumentFragment();

// заполнене блока DOM-элементами на основе массива JS-объектов
for (var j = 0; j < pictures.length; j++) {
  fragment.appendChild(renderPicture(pictures[j]));
}
locationOfPicture.appendChild(fragment);

var bigPicture = document.querySelector('.big-picture');
bigPicture.classList.remove('hidden');

// функция для создания DOM-элемента комментария согласно html-разметке
var createComment = function (el) {
  var commentItem = makeElement('li', 'social__comment');

  var localPicture = makeElement('img', 'social__picture');
  localPicture.src = el.avatar;
  localPicture.alt = el.name;
  localPicture.style.width = '35';
  localPicture.style.height = '35';
  commentItem.appendChild(localPicture);

  var commentMessage = makeElement('p', 'social__text', el.message);
  commentItem.appendChild(commentMessage);

  return commentItem;
};

// функция переопределения атрибутов DOM-элемента
var setItem = function (oldItem, newItem) {
  oldItem.querySelector('.big-picture__img').children.src = newItem.url;
  oldItem.querySelector('.big-picture__img').children.alt = newItem.url;
  oldItem.querySelector('.comments-count').textContent = newItem.comments.length;
  oldItem.querySelector('.likes-count').textContent = newItem.likes;
  oldItem.querySelector('.social__caption').textContent = newItem.description;

  var fragmentForСomments = document.createDocumentFragment();
  // добавляем необходимое кол-во комментариев
  for (var m = 0; m < newItem.comments.length; m++) {
    var commentItem = createComment(newItem.comments[m]);

    fragmentForСomments.appendChild(commentItem);
  }
  oldItem.querySelector('.social__comments').innerHTML = '';
  oldItem.querySelector('.social__comments').appendChild(fragmentForСomments);
};

// переопределяем атрибутыглавное картинки на 1й элемент массива
setItem(bigPicture, pictures[0]);

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');
