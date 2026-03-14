import './scss/styles.scss';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { apiProducts } from './utils/data';

console.log('========== ПРОВЕРКА РАБОТЫ МОДЕЛЕЙ ДАННЫХ ==========');

// ===== ПРОВЕРКА CATALOG MODEL =====
console.log('\n----- Тестируем CatalogModel -----');

const catalogModel = new CatalogModel();
console.log('1. Сохраняем товары в каталог');
catalogModel.setItems(apiProducts.items);

console.log('2. Получаем массив товаров из каталога:');
console.log(catalogModel.getItems());

console.log('3. Получаем первый товар по id:');
const firstItem = catalogModel.getItems()[0];
if (firstItem) {
  const foundItem = catalogModel.getItem(firstItem.id);
  console.log('Найденный товар:', foundItem);
}

console.log('4. Сохраняем выбранный товар для просмотра:');
catalogModel.setSelectedItem(firstItem);
console.log('Выбранный товар:', catalogModel.getSelectedItem());

// ===== ПРОВЕРКА BASKET MODEL =====
console.log('\n----- Тестируем BasketModel -----');

const basketModel = new BasketModel();
console.log('1. Корзина пуста. Товаров в корзине:', basketModel.getCount());

console.log('2. Добавляем первый товар в корзину');
basketModel.addItem(apiProducts.items[0]);
console.log('Товаров в корзине:', basketModel.getCount());
console.log('Товары в корзине:', basketModel.getItems());

console.log('3. Добавляем второй товар в корзину');
basketModel.addItem(apiProducts.items[1]);
console.log('Товаров в корзине:', basketModel.getCount());

console.log('4. Общая стоимость товаров в корзине:', basketModel.getTotalPrice());

console.log('5. Проверяем, есть ли первый товар в корзине:');
const firstItemId = apiProducts.items[0].id;
console.log('Товар с id', firstItemId, 'в корзине?', basketModel.contains(firstItemId));

console.log('6. Удаляем первый товар из корзины');
basketModel.removeItem(firstItemId);
console.log('Товаров в корзине после удаления:', basketModel.getCount());

console.log('7. Очищаем корзину');
basketModel.clear();
console.log('Товаров в корзине после очистки:', basketModel.getCount());

// ===== ПРОВЕРКА BUYER MODEL =====
console.log('\n----- Тестируем BuyerModel -----');

const buyerModel = new BuyerModel();

console.log('1. Проверяем валидацию без данных:');
console.log('Ошибки:', buyerModel.validate());

console.log('2. Заполняем данные покупателя:');
buyerModel.setPayment('card');
buyerModel.setAddress('ул. Пушкина, д. 10');
buyerModel.setEmail('test@mail.ru');
buyerModel.setPhone('+79991234567');

console.log('3. Проверяем валидацию после заполнения:');
console.log('Ошибки:', buyerModel.validate());
console.log('Первый шаг валиден?', buyerModel.isFirstStepValid());
console.log('Второй шаг валиден?', buyerModel.isSecondStepValid());

console.log('4. Получаем все данные покупателя:');
console.log(buyerModel.getBuyerData());

console.log('5. Очищаем данные покупателя');
buyerModel.clear();
console.log('Данные после очистки:', buyerModel.getBuyerData());
console.log('Ошибки после очистки:', buyerModel.validate());

console.log('\n========== ПРОВЕРКА ЗАВЕРШЕНА ==========');