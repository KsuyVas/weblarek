import "./scss/styles.scss";
import { CatalogModel } from "./components/Models/CatalogModel";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";
import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { LarekAPI } from "./components/API/LarekAPI";
import { EventEmitter } from "./components/base/Events";
import { ensureElement, cloneTemplate } from "./utils/utils";

// Импорты View компонентов
import { Modal } from "./components/View/Modal";
import { Header } from "./components/View/Header";
import { Gallery } from "./components/View/Gallery";
import { CardCatalog } from "./components/View/CardCatalog";
import { CardPreview } from "./components/View/CardPreview";
import { CardBasket } from "./components/View/CardBasket";
import { Basket } from "./components/View/Basket";
import { OrderForm } from "./components/View/OrderForm";
import { ContactsForm } from "./components/View/ContactsForm";
import { Success } from "./components/View/Success";

// Типы
import { IProduct, IOrder } from "./types";

// ИНИЦИАЛИЗАЦИЯ
console.log("🚀 Запуск приложения Web-Larёk");

// Создаём брокер событий
const events = new EventEmitter();

// Создаём API
const apiBase = new Api(API_URL);
const api = new LarekAPI(apiBase);

// Создаём модели данных
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

//ПОИСК DOM-ЭЛЕМЕНТОВ (через ensureElement)
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const headerContainer = ensureElement<HTMLElement>('.header');
const galleryContainer = ensureElement<HTMLElement>('.gallery');


const catalogCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

//СОЗДАНИЕ ЭКЗЕМПЛЯРОВ КОМПОНЕНТОВ
const modal = new Modal(modalContainer);
const header = new Header(headerContainer, events);
const gallery = new Gallery(galleryContainer);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

//ПЕРЕМЕННЫЕ ДЛЯ ХРАНЕНИЯ ДАННЫХ
let currentProduct: IProduct | null = null;

//ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ

function getImageUrl(imagePath: string): string {
    return CDN_URL + imagePath;
}

// Функции валидации
function isOrderStepValid(): boolean {
    const errors = buyerModel.validate();
    return !errors.payment && !errors.address;
}

function isContactsStepValid(): boolean {
    const errors = buyerModel.validate();
    return !errors.email && !errors.phone;
}

// ОТРИСОВКА КОМПОНЕНТОВ

// Отрисовка каталога
function renderCatalog() {
    const products = catalogModel.getItems();
    const cards = products.map(product => {
        const cardElement = cloneTemplate(catalogCardTemplate);
        const card = new CardCatalog(cardElement, {
            onClick: () => {
                events.emit('card:select', { id: product.id });
            }
        });
        
        card.render({
            title: product.title,
            price: product.price,
            category: product.category,
            image: getImageUrl(product.image)
        });
        
        return cardElement;
    });
    
    gallery.render({ items: cards });
}

// Отрисовка корзины
function renderBasket() {
    const basketItems = basketModel.getItems();
    const cards = basketItems.map((item, index) => {
        const cardElement = cloneTemplate(basketCardTemplate);
        const card = new CardBasket(cardElement, {
            onDeleteClick: () => {
                events.emit('basket:remove', { id: item.id });
            }
        });
        
        card.render({
            title: item.title,
            price: item.price,
            index: index + 1
        });
        
        return cardElement;
    });
    
    basket.render({
        items: cards,
        totalPrice: basketModel.getTotalPrice(),
        buttonDisabled: basketModel.getCount() === 0
    });
}

// Отрисовка превью товара
function renderPreview() {
    if (!currentProduct) return;
    
    const isInBasket = basketModel.contains(currentProduct.id);
    
    let buttonText = 'В корзину';
    let disabled = false;
    
    if (currentProduct.price === null) {
        buttonText = 'Недоступно';
        disabled = true;
    } else if (isInBasket) {
        buttonText = 'Удалить из корзины';
        disabled = false;
    } else {
        buttonText = 'В корзину';
        disabled = false;
    }
    
    const previewElement = cloneTemplate(previewTemplate);
    const preview = new CardPreview(previewElement, {
        onButtonClick: () => {
            events.emit('preview:buttonClick', { id: currentProduct!.id });
        }
    });
    
    
    preview.render({
        title: currentProduct.title,
        price: currentProduct.price,
        category: currentProduct.category,
        image: getImageUrl(currentProduct.image),
        description: currentProduct.description,
        buttonText: buttonText,
        disabled: disabled
    });
    
    modal.content = previewElement;
}

// Отрисовка формы заказа 
function renderOrderForm() {
    const buyerData = buyerModel.getBuyerData();
    const errors = buyerModel.validate();
    
    orderForm.render({
        payment: buyerData.payment,
        address: buyerData.address
    });
    orderForm.valid = !errors.payment && !errors.address;
    orderForm.errors = errors.payment || errors.address || '';
}

// Отрисовка формы контактов 
function renderContactsForm() {
    const buyerData = buyerModel.getBuyerData();
    const errors = buyerModel.validate();
    
    contactsForm.render({
        email: buyerData.email,
        phone: buyerData.phone
    });
    contactsForm.valid = !errors.email && !errors.phone;
    contactsForm.errors = errors.email || errors.phone || '';
}

// НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ 

// События от моделей данных
events.on('catalog:changed', () => {
    renderCatalog();
});

events.on('catalog:selectedChanged', () => {
    renderPreview();
});

events.on('basket:changed', () => {
    header.counter = basketModel.getCount();
    renderBasket();
});

events.on('buyer:changed', () => {
    renderOrderForm();
    renderContactsForm();
});

//События от представлений

// Выбор карточки в каталоге
events.on('card:select', ({ id }: { id: string }) => {
    const product = catalogModel.getItem(id);
    if (product) {
        currentProduct = product;  // ← сначала установить
        catalogModel.setSelectedItem(product);  // ← потом вызвать модель
        modal.open();
    }
});

// Клик по кнопке в превью
events.on('preview:buttonClick', ({ id }: { id: string }) => {
    const product = catalogModel.getItem(id);
    if (!product) return;
    
    if (basketModel.contains(id)) {
        basketModel.removeItem(id);
    } else {
        if (product.price !== null) {
            basketModel.addItem(product);
        }
    }
    modal.close();
});

// Удаление товара из корзины
events.on('basket:remove', ({ id }: { id: string }) => {
    basketModel.removeItem(id);
});

// Открытие корзины
events.on('basket:open', () => {
   modal.content = basket.getContainer();
    modal.open();
});

// Оформление заказа (кнопка в корзине)
events.on('basket:order', () => {
    modal.content = orderForm.getContainer();
    modal.open();
});

// Изменение способа оплаты
events.on('order.paymentChange', ({ payment }: { payment: 'card' | 'cash' }) => {
    buyerModel.setPayment(payment);
});

// Изменение адреса
events.on('order.addressChange', ({ address }: { address: string }) => {
    buyerModel.setAddress(address);
});

// Отправка формы заказа 
events.on('order.submit', () => {
    if (isOrderStepValid()) {
        modal.content = contactsForm.getContainer();
    }
});

// Изменение email
events.on('contacts.emailChange', ({ email }: { email: string }) => {
    buyerModel.setEmail(email);
});

// Изменение телефона
events.on('contacts.phoneChange', ({ phone }: { phone: string }) => {
    buyerModel.setPhone(phone);
});

// Отправка заказа
events.on('contacts.submit', async () => {
    if (!isContactsStepValid() || basketModel.getCount() === 0) return;
    
    const buyerData = buyerModel.getBuyerData();
    const orderData: IOrder = {
        payment: buyerData.payment!,
        address: buyerData.address,
        email: buyerData.email,
        phone: buyerData.phone,
        total: basketModel.getTotalPrice(),
        items: basketModel.getItemIds()
    };
    
    try {
        const result = await api.orderProduct(orderData);
        success.render({ total: result.total });
         modal.content = success.getContainer();
        
        basketModel.clear();
        buyerModel.clear();
    } catch (error) {
        console.error('Ошибка оформления заказа:', error);
    }
});

// Закрытие окна успеха
events.on('success:close', () => {
    modal.close();
});

// ЗАГРУЗКА ТОВАРОВ
async function loadProducts() {
    try {
        const products = await api.getProductList();
        catalogModel.setItems(products);
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
}

loadProducts();