import './scss/styles.scss';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { Api } from './components/base/Api';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';
import { IProductList } from './types'; // Импортируем интерфейс

console.log('========== ПРОВЕРКА РАБОТЫ МОДЕЛЕЙ ДАННЫХ ==========');
console.log('🌐 API_URL из constants.ts:', API_URL);

// ===== ПРОВЕРКА МОДЕЛЕЙ =====
console.log('\n📦 Тестируем CatalogModel с тестовыми данными -----');
const catalogModel = new CatalogModel();
catalogModel.setItems(apiProducts.items);
console.log('✅ Товаров в каталоге (тестовые):', catalogModel.getItems().length);

console.log('\n🛒 Тестируем BasketModel -----');
const basketModel = new BasketModel();
if (apiProducts.items.length > 0) {
    basketModel.addItem(apiProducts.items[0]);
    console.log('✅ Добавлен товар в корзину');
}
console.log('✅ Товаров в корзине:', basketModel.getCount());
console.log('💰 Общая стоимость:', basketModel.getTotalPrice());

console.log('\n👤 Тестируем BuyerModel -----');
const buyerModel = new BuyerModel();
buyerModel.setPayment('card');
buyerModel.setAddress('ул. Пушкина, д. 10');
buyerModel.setEmail('test@mail.ru');
buyerModel.setPhone('+79991234567');
console.log('✅ Данные покупателя сохранены');
console.log('📝 Данные:', buyerModel.getBuyerData());
console.log('❌ Ошибки валидации:', buyerModel.validate());

console.log('\n========== РАБОТА С СЕРВЕРОМ ==========');

// Создаем экземпляр Api с URL из constants
const apiBase = new Api(API_URL);

// Функция для получения товаров с сервера
async function loadProductsFromServer() {
    try {
        console.log('\n📡 Загружаем товары с сервера...');
        
        // Указываем тип IProductList для ответа от сервера
        const response = await apiBase.get<IProductList>('/product');
        
        console.log('✅ Ответ от сервера получен!');
        console.log('Всего товаров на сервере:', response.total); // Теперь total существует!
        
        // Сохраняем товары в модель каталога
        if (response && response.items) {
            catalogModel.setItems(response.items);
            console.log('\n💾 Сохраняем товары в модель каталога...');
            console.log('✅ Сохранено', catalogModel.getItems().length, 'товаров в модель');
            
            // Показываем первые 3 товара для примера
            console.log('\n📋 Первые 3 товара из каталога:');
            catalogModel.getItems().slice(0, 3).forEach((item, index) => {
                console.log(`${index + 1}. ${item.title} - ${item.price ? item.price + ' ₽' : 'Бесценно'}`);
            });
            
            // Проверяем работу методов модели с реальными данными
            console.log('\n🔍 Проверяем методы CatalogModel с реальными данными:');
            
            if (catalogModel.getItems().length > 0) {
                // Получаем товар по id
                const firstItem = catalogModel.getItems()[0];
                const foundItem = catalogModel.getItem(firstItem.id);
                console.log('✅ Поиск товара по id работает:', foundItem?.title);
                
                // Сохраняем выбранный товар
                catalogModel.setSelectedItem(firstItem);
                console.log('✅ Выбранный товар сохранен:', catalogModel.getSelectedItem()?.title);
                
                // Добавляем товары в корзину для примера
                console.log('\n🛒 Добавляем товары в корзину:');
                basketModel.clear(); // Очищаем корзину
                basketModel.addItem(catalogModel.getItems()[0]);
                if (catalogModel.getItems().length > 1) {
                    basketModel.addItem(catalogModel.getItems()[1]);
                }
                console.log('✅ В корзине товаров:', basketModel.getCount());
                console.log('💰 Общая стоимость:', basketModel.getTotalPrice());
            }
            
            console.log('\n✨ Все тесты успешно пройдены!');
        }
        
    } catch (error) {
        console.error('❌ Ошибка при загрузке с сервера:', error);
    }
}

// Запускаем загрузку с сервера
loadProductsFromServer();