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
