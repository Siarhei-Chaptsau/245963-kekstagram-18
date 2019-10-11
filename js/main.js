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
// bigPicture.classList.remove('hidden'); TODO

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

// переопределяем атрибуты для главной картинки на 1й элемент массива
setItem(bigPicture, pictures[0]);

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
// var START_X_PIN_LEVEL = 600;
// var END_X_PIN_LEVEL = 1050;

var uploadOverlay = document.querySelector('.img-upload__overlay');
var uploadFile = document.querySelector('#upload-file');
var btnUploadCancel = document.querySelector('.img-upload__cancel');
var pinLevelEffect = document.querySelector('.effect-level__pin');
var pinLevelValue = document.querySelector('.effect-level__value');
var effectsItem = document.querySelectorAll('.effects__item');

var scaleButtons = document.querySelector('.img-upload__scale');
var imgUploadPreview = document.querySelector('.img-upload__preview');
var scaleValueButton = document.querySelector('.scale__control--value');
var slider = document.querySelector('.img-upload__effect-level');

var inputHashtags = document.querySelector('.text__hashtags');

// var effectsList = document.querySelector('.effects__list');
// var noneEffect = effectsList.querySelector('#effect-none');
// var chromeEffect = effectsList.querySelector('#effect-chrome');
// var sepiaEffect = effectsList.querySelector('#effect-sepia');
// var marvinEffect = effectsList.querySelector('#effect-marvin');
// var phobosEffect = effectsList.querySelector('#effect-phobos');
// var heatEffect = effectsList.querySelector('#effect-heat');

var lib = {
  'effects__preview--chrome': {
    name: 'grayscale',
    setPercent: function (val) {
      return val / 100;
    }
  },
  'effects__preview--sepia': {
    name: 'sepia',
    setPercent: function (val) {
      return val / 100;
    }
  },
  'effects__preview--marvin': {
    name: 'invert',
    setPercent: function (val) {
      return val + '%';
    }
  },
  'effects__preview--phobos': {
    name: 'blur',
    setPercent: function (val) {
      return val * 0.03 + 'px';
    },
    min: 0,
    max: '3px'
  },
  'effects__preview--heat': {
    name: 'brightness',
    setPercent: function (val) {
      return val * 0.02 + 1;
    }
  }
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var openPopup = function () {
  uploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

var closePopup = function () {
  uploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
  uploadFile.value = '';
};

uploadFile.addEventListener('change', function () {
  openPopup();
});

btnUploadCancel.addEventListener('click', function () {
  closePopup();
});

btnUploadCancel.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closePopup();
  }
});

// функция регуляции размера превью фото
var setScaleValueHandler = function (evt) {
  var percent = parseInt(scaleValueButton.value, 10);

  if (evt.target.matches('.scale__control--bigger')) {
    percent += 25;
    if (percent >= 100) {
      percent = 100;
    }
  } else if (evt.target.matches('.scale__control--smaller')) {
    percent -= 25;
    if (percent < 25) {
      percent = 25;
    }
  }
  imgUploadPreview.style = 'transform:scale(' + percent / 100 + ')';
  scaleValueButton.value = percent + '%';
};

scaleButtons.addEventListener('click', setScaleValueHandler);

// window.pinLevel = pinLevelValue.value;
// Math.round((evt.clientX - START_X_PIN_LEVEL) / (END_X_PIN_LEVEL - START_X_PIN_LEVEL) * 100));
pinLevelEffect.addEventListener('mouseup', function () {
  // window.pinLevel = mouseup.value;
});

// дефолтное значение размера превью фото
scaleValueButton.setAttribute('value', '100%');
scaleValueButton.value = '100%';

// По дефолту слайдер скрывается - эффект 'Оригинал'
slider.hidden = true;

// изменение превью фото при нажатии на эффект
var setPhotoEffectHandler = function (evt) {
  if (evt.target.matches('.effects__preview')) {
    var arrClassForPreviewPhoto = evt.target.className.split('  ');

    // уровень эффекта cбрасывается до начального состояния
    pinLevelValue.setAttribute('value', '100');

    // размер превью фото по умолчанию
    scaleValueButton.setAttribute('value', '100%');
    scaleValueButton.value = '100%';
    imgUploadPreview.style = '';

    // скидываем предыдущие классы превью фото:
    imgUploadPreview.classList = 'img-upload__preview';

    // добаввляем превью фото класс эффекта из массива классов элемента на которое произошло нажатие:
    arrClassForPreviewPhoto.forEach(function (item) {
      if (item !== 'effects__preview') {
        imgUploadPreview.classList.add(item);

        if (item !== 'effects__preview--none') {
          slider.hidden = false;
          imgUploadPreview.style = 'filter:' + lib[item].name + '(' + lib[item].setPercent(pinLevelValue.value) + ')';
        } else {
          slider.hidden = true;
        }
      }
    });
  }
};

for (var y = 0; y < effectsItem.length; y++) {
  effectsItem[y].addEventListener('click', setPhotoEffectHandler);
}

var validateHashtags = function () {
  document.removeEventListener('keydown', onPopupEscPress);

  var arrHashtags = inputHashtags.value.trim().toLowerCase().split(/\s+/);
  var duplicatedHashtags = arrHashtags.sort().filter(function (item, l, array) {
    return array[l - 1] && item === array[l - 1];
  });

  arrHashtags.filter(function (el, k, arr) {
    if (el.length > 20) {
      inputHashtags.setCustomValidity('Максимальная длина одного хэш-тега 19 символов');
    } else if (el.length < 2) {
      inputHashtags.setCustomValidity('Хэш-тег не может состоять только из одной решётки');
    } else if (arr.length > 4) {
      inputHashtags.setCustomValidity('Нельзя указать больше пяти хэш-тегов');
    } else if (duplicatedHashtags.length) {
      inputHashtags.setCustomValidity('Хэштеги не могут быть одинаковыми');
    } else if (el.substring(0, 1) !== '#') {
      inputHashtags.setCustomValidity('Хэш-тег начинается с символа #');
    } else {
      inputHashtags.setCustomValidity('');
    }
    return el;
  });
};

inputHashtags.addEventListener('input', validateHashtags);
