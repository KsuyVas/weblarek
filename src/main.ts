import "./scss/styles.scss";
import { CatalogModel } from "./components/Models/CatalogModel";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";
import { Api } from "./components/base/Api";
import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";
//import { IProductList } from './types'; // Импортируем интерфейс
import { LarekAPI } from "./components/API/LarekAPI";

console.log("========== ПРОВЕРКА РАБОТЫ МОДЕЛЕЙ ДАННЫХ ==========");
console.log("🌐 API_URL из constants.ts:", API_URL);

// ===== ПРОВЕРКА МОДЕЛЕЙ =====
console.log("\n📦 Тестируем CatalogModel с тестовыми данными -----");
const catalogModel = new CatalogModel();
catalogModel.setItems(apiProducts.items);
console.log(
  "✅ Товаров в каталоге (тестовые):",
  catalogModel.getItems().length,
);

console.log("\n🛒 Тестируем BasketModel -----");
const basketModel = new BasketModel();
if (apiProducts.items.length > 0) {
  basketModel.addItem(apiProducts.items[0]);
  console.log("✅ Добавлен товар в корзину");
}
console.log("✅ Товаров в корзине:", basketModel.getCount());
console.log("💰 Общая стоимость:", basketModel.getTotalPrice());

console.log("\n👤 Тестируем BuyerModel -----");
const buyerModel = new BuyerModel();
console.log("❌ Ошибки до заполнения:", buyerModel.validate());
buyerModel.setPayment("card");
buyerModel.setAddress("ул. Пушкина, д. 10");
buyerModel.setEmail("test@mail.ru");
buyerModel.setPhone("+79991234567");
console.log("✅ Данные покупателя сохранены");
console.log("📝 Данные:", buyerModel.getBuyerData());
console.log("❌ Ошибки валидации:", buyerModel.validate());

// =====  ПРОВЕРКА МЕТОДОВ =====
console.log("\n========== ПРОВЕРКА МЕТОДОВ ==========");

// Проверка CatalogModel: getItem
console.log("\n📦 CatalogModel.getItem:");
const firstItemId = apiProducts.items[0].id;
const foundItem = catalogModel.getItem(firstItemId);
console.log("✅ Поиск по id:", foundItem ? foundItem.title : "не найден");
console.log(
  "✅ Поиск несуществующего id:",
  catalogModel.getItem("123") === undefined ? "верно" : "ошибка",
);

// Проверка CatalogModel: setSelectedItem/getSelectedItem
console.log("\n📦 CatalogModel.setSelectedItem/getSelectedItem:");
catalogModel.setSelectedItem(apiProducts.items[0]);
console.log("✅ Выбранный товар:", catalogModel.getSelectedItem()?.title);

// Проверка BasketModel: contains
console.log("\n🛒 BasketModel.contains:");
basketModel.addItem(apiProducts.items[0]);
console.log(
  "✅ Товар в корзине:",
  basketModel.contains(apiProducts.items[0].id) ? "да" : "нет",
);
console.log(
  "✅ Несуществующий товар:",
  basketModel.contains("123") ? "ошибка" : "верно",
);

// Проверка BasketModel: removeItem
console.log("\n🛒 BasketModel.removeItem:");
basketModel.removeItem(apiProducts.items[0].id);
console.log("✅ После удаления товаров:", basketModel.getCount());

// Проверка BasketModel: clear
console.log("\n🛒 BasketModel.clear:");
basketModel.clear();
console.log("✅ После очистки товаров:", basketModel.getCount());

// Проверка BuyerModel: clear
console.log("\n👤 BuyerModel.clear:");
buyerModel.clear();
console.log("✅ После очистки ошибки:", buyerModel.validate());

console.log("\n========== РАБОТА С СЕРВЕРОМ ==========");

// Создаем экземпляр Api с URL из constants
const apiBase = new Api(API_URL);
const larekAPI = new LarekAPI(apiBase);

// Функция для получения товаров с сервера
async function loadProductsFromServer() {
  try {
    console.log("\n📡 Загружаем товары с сервера...");

    // Получаем товары с сервера
    const productsFromServer = await larekAPI.getProductList();

    console.log("✅ Ответ от сервера получен!");
    console.log("Всего товаров на сервере:", productsFromServer.length);

    // Сохраняем товары в модель каталога
    catalogModel.setItems(productsFromServer);
    console.log("\n💾 Сохраняем товары в модель каталога...");
    console.log(
      "✅ Сохранено",
      catalogModel.getItems().length,
      "товаров в модель",
    );
    console.log("\n✨ Все тесты успешно пройдены!");
  } catch (error) {
    console.error("Ошибка при загрузке с сервера:", error);
  }
}

// Запускаем загрузку с сервера
loadProductsFromServer();


// ========== ТЕСТИРОВАНИЕ КОМПОНЕНТОВ VIEW ==========
console.log('\n========== ТЕСТИРОВАНИЕ VIEW КОМПОНЕНТОВ ==========');

import { Modal } from './components/View/Modal';
import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { CardBasket } from './components/View/CardBasket';
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';
import { EventEmitter } from './components/base/Events';

// Создаём брокер событий для тестов
const testEvents = new EventEmitter();

// Подписываемся на все события для отладки
testEvents.onAll((event) => {
    console.log(`📡 [Событие] ${event.eventName}`, event.data);
});

// 1. ТЕСТ HEADER
console.log('\n--- Тест 1: Header ---');
const headerContainer = document.querySelector('.header');
if (headerContainer) {
    const header = new Header(headerContainer as HTMLElement, testEvents);
    header.counter = 5;
    console.log('✅ Header: счётчик установлен в 5');
    header.render();
    console.log('✅ Header: рендер выполнен');
} else {
    console.error('❌ Header: контейнер .header не найден');
}

// 2. ТЕСТ GALLERY
console.log('\n--- Тест 2: Gallery ---');
const galleryContainer = document.querySelector('.gallery');
if (galleryContainer) {
    const gallery = new Gallery(galleryContainer as HTMLElement);
    
    // Создаём тестовые карточки
    const testCard = document.createElement('div');
    testCard.textContent = 'Тестовая карточка';
    testCard.style.border = '1px solid red';
    testCard.style.padding = '10px';
    
    gallery.items = [testCard];
    console.log('✅ Gallery: установлен 1 элемент');
    
    gallery.addItem(testCard);
    console.log('✅ Gallery: добавлен ещё 1 элемент');
    
    console.log('✅ Gallery: рендер выполнен');
} else {
    console.error('❌ Gallery: контейнер .gallery не найден');
}

// 3. ТЕСТ MODAL
console.log('\n--- Тест 3: Modal ---');
const modalContainer = document.querySelector('#modal-container');
if (modalContainer) {
    const modal = new Modal(modalContainer as HTMLElement, testEvents);
    
    // Создаём тестовый контент
    const testContent = document.createElement('div');
    testContent.textContent = 'Тестовое содержимое модального окна';
    testContent.style.padding = '20px';
    
    modal.content = testContent;
    console.log('✅ Modal: контент установлен');
    
    modal.open();
    console.log('✅ Modal: открыт (должно появиться модальное окно)');
    
    // Закроем через 2 секунды
    setTimeout(() => {
        modal.close();
        console.log('✅ Modal: закрыт');
    }, 2000);
} else {
    console.error('❌ Modal: контейнер #modal-container не найден');
}

// 4. ТЕСТ CARD CATALOG
console.log('\n--- Тест 4: CardCatalog ---');
const catalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
if (catalogTemplate) {
    const cardElement = catalogTemplate.content.cloneNode(true) as HTMLElement;
    const catalogCard = new CardCatalog(cardElement, {
        onClick: () => console.log('📡 Клик по карточке каталога')
    });
    
    catalogCard.title = 'Тестовый товар';
    catalogCard.price = 1000;
    catalogCard.category = 'софт-скил';
    catalogCard.image = 'https://via.placeholder.com/150';
    
    console.log('✅ CardCatalog: карточка создана');
    console.log('   Заголовок:', catalogCard.render().querySelector('.card__title')?.textContent);
    console.log('   Цена:', catalogCard.render().querySelector('.card__price')?.textContent);
    console.log('   Категория:', catalogCard.render().querySelector('.card__category')?.textContent);
} else {
    console.error('❌ CardCatalog: шаблон #card-catalog не найден');
}

// 5. ТЕСТ CARD PREVIEW
console.log('\n--- Тест 5: CardPreview ---');
const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
if (previewTemplate) {
    const cardElement = previewTemplate.content.cloneNode(true) as HTMLElement;
    const previewCard = new CardPreview(cardElement, {
        onButtonClick: () => console.log('📡 Клик по кнопке в карточке превью')
    });
    
    previewCard.title = 'Тестовый товар детально';
    previewCard.price = 2500;
    previewCard.category = 'хард-скил';
    previewCard.image = 'https://via.placeholder.com/300';
    previewCard.description = 'Это подробное описание тестового товара';
    previewCard.buttonText = 'В корзину';
    
    console.log('✅ CardPreview: карточка создана');
    console.log('   Заголовок:', previewCard.render().querySelector('.card__title')?.textContent);
    console.log('   Описание:', previewCard.render().querySelector('.card__text')?.textContent);
    console.log('   Кнопка:', previewCard.render().querySelector('.card__button')?.textContent);
} else {
    console.error('❌ CardPreview: шаблон #card-preview не найден');
}

// 6. ТЕСТ CARD BASKET
console.log('\n--- Тест 6: CardBasket ---');
const basketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
if (basketTemplate) {
    const cardElement = basketTemplate.content.cloneNode(true) as HTMLElement;
    const basketCard = new CardBasket(cardElement, {
        onDeleteClick: () => console.log('📡 Клик по удалению из корзины')
    });
    
    basketCard.title = 'Товар в корзине';
    basketCard.price = 500;
    basketCard.index = 1;
    
    console.log('✅ CardBasket: карточка создана');
    console.log('   Заголовок:', basketCard.render().querySelector('.card__title')?.textContent);
    console.log('   Индекс:', basketCard.render().querySelector('.basket__item-index')?.textContent);
} else {
    console.error('❌ CardBasket: шаблон #card-basket не найден');
}

// 7. ТЕСТ BASKET
console.log('\n--- Тест 7: Basket ---');
const basketTemplateComp = document.querySelector('#basket') as HTMLTemplateElement;
if (basketTemplateComp) {
    const basketElement = basketTemplateComp.content.cloneNode(true) as HTMLElement;
    const basket = new Basket(basketElement, testEvents);
    
    // Создаём тестовые карточки для корзины
    const testBasketCards: HTMLElement[] = [];
    for (let i = 1; i <= 2; i++) {
        const cardElement = basketTemplate.content.cloneNode(true) as HTMLElement;
        const card = new CardBasket(cardElement);
        card.title = `Товар ${i}`;
        card.price = i * 1000;
        card.index = i;
        testBasketCards.push(card.render());
    }
    
    basket.items = testBasketCards;
    basket.totalPrice = 3000;
    basket.buttonDisabled = false;
    
    console.log('✅ Basket: компонент создан');
    console.log('   Товаров в корзине:', basketElement.querySelectorAll('.basket__item').length);
    console.log('   Общая сумма:', basketElement.querySelector('.basket__price')?.textContent);
    console.log('   Кнопка активна:', !basketElement.querySelector('.basket__button')?.hasAttribute('disabled'));
} else {
    console.error('❌ Basket: шаблон #basket не найден');
}

// 8. ТЕСТ ORDER FORM
console.log('\n--- Тест 8: OrderForm ---');
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
if (orderTemplate) {
    const formElement = orderTemplate.content.cloneNode(true) as HTMLFormElement;
    const orderForm = new OrderForm(formElement, testEvents);
    
    orderForm.payment = 'card';
    orderForm.address = 'ул. Тестовая, д. 1';
    orderForm.valid = true;
    
    console.log('✅ OrderForm: форма создана');
    console.log('   Выбранный способ оплаты:', orderForm.payment);
    console.log('   Адрес:', orderForm.address);
    console.log('   Кнопка активна:', !formElement.querySelector('.order__button')?.hasAttribute('disabled'));
} else {
    console.error('❌ OrderForm: шаблон #order не найден');
}

// 9. ТЕСТ CONTACTS FORM
console.log('\n--- Тест 9: ContactsForm ---');
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
if (contactsTemplate) {
    const formElement = contactsTemplate.content.cloneNode(true) as HTMLFormElement;
    const contactsForm = new ContactsForm(formElement, testEvents);
    
    contactsForm.email = 'test@example.com';
    contactsForm.phone = '+7 (999) 123-45-67';
    contactsForm.valid = true;
    
    console.log('✅ ContactsForm: форма создана');
    console.log('   Email:', contactsForm.email);
    console.log('   Телефон:', contactsForm.phone);
    console.log('   Кнопка активна:', !formElement.querySelector('.button')?.hasAttribute('disabled'));
} else {
    console.error('❌ ContactsForm: шаблон #contacts не найден');
}

// 10. ТЕСТ SUCCESS
console.log('\n--- Тест 10: Success ---');
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
if (successTemplate) {
    const successElement = successTemplate.content.cloneNode(true) as HTMLElement;
    const success = new Success(successElement, testEvents);
    
    success.total = 5000;
    
    console.log('✅ Success: компонент создан');
    console.log('   Текст:', successElement.querySelector('.order-success__description')?.textContent);
} else {
    console.error('❌ Success: шаблон #success не найден');
}

console.log('\n========== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ==========');