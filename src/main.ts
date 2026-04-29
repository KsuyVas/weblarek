import "./scss/styles.scss";
import { CatalogModel } from "./components/Models/CatalogModel";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";
import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { LarekAPI } from "./components/API/LarekAPI";
import { EventEmitter } from "./components/base/Events";
import { TFormErrors } from "./types";

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

// брокер событий
const events = new EventEmitter();

//  API
const apiBase = new Api(API_URL);
const api = new LarekAPI(apiBase);

// модели данных
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// ПОИСК DOM-ЭЛЕМЕНТОВ 
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const headerContainer = document.querySelector('.header') as HTMLElement;
const galleryContainer = document.querySelector('.gallery') as HTMLElement;

// базовые View компоненты
const modal = new Modal(modalContainer, events);
const header = new Header(headerContainer, events);
const gallery = new Gallery(galleryContainer);

// ПЕРЕМЕННЫЕ ДЛЯ ХРАНЕНИЯ АКТИВНЫХ ФОРМ
let currentOrderForm: OrderForm | null = null;
let currentContactsForm: ContactsForm | null = null;

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ

function getImageUrl(imagePath: string): string {
    return CDN_URL + imagePath;
}

function renderCatalog() {
    const products = catalogModel.getItems();
    const cards: HTMLElement[] = [];
    
    products.forEach(product => {
        const template = document.querySelector('#card-catalog') as HTMLTemplateElement;
        const cardElement = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!cardElement) return;
        
        const card = new CardCatalog(cardElement, {
            onClick: () => {
                events.emit('card:select', { id: product.id });
            }
        });
        
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = getImageUrl(product.image);
        
        cards.push(card.render());
    });
    
    gallery.items = cards;
}

function openBasket() {
    const template = document.querySelector('#basket') as HTMLTemplateElement;
    const element = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!element) return;
    
    const basket = new Basket(element, events);
    const basketItems = basketModel.getItems();
    const cards: HTMLElement[] = [];
    
    basketItems.forEach((item, index) => {
        const cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
        const cardElement = cardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!cardElement) return;
        
        const card = new CardBasket(cardElement, {
            onDeleteClick: () => {
                events.emit('basket:remove', { id: item.id });
            }
        });
        
        card.title = item.title;
        card.price = item.price;
        card.index = index + 1;
        
        cards.push(card.render());
    });
    
    basket.items = cards;
    basket.totalPrice = basketModel.getTotalPrice();
    basket.buttonDisabled = basketModel.getCount() === 0;
    
    modal.content = basket.render();
    modal.open();
}

function openProductPreview(product: IProduct) {
    const template = document.querySelector('#card-preview') as HTMLTemplateElement;
    const element = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!element) return;
    
    const isInBasket = basketModel.contains(product.id);
    
    const preview = new CardPreview(element, {
        onButtonClick: () => {
            if (isInBasket) {
                events.emit('card:removeFromBasket', { id: product.id });
                modal.close();
            } else {
                events.emit('card:addToBasket', { id: product.id });
                modal.close();
            }
        }
    });
    
    preview.title = product.title;
    preview.price = product.price;
    preview.category = product.category;
    preview.image = getImageUrl(product.image);
    preview.description = product.description;
    
    if (product.price === null) {
        preview.buttonText = 'Недоступно';
        preview.disabled = true;
    } else if (isInBasket) {
        preview.buttonText = 'Удалить из корзины';
        preview.disabled = false;
    } else {
        preview.buttonText = 'В корзину';
        preview.disabled = false;
    }
    
    modal.content = preview.render();
    modal.open();
}

function openOrderForm() {
    const template = document.querySelector('#order') as HTMLTemplateElement;
    const element = template.content.firstElementChild?.cloneNode(true) as HTMLFormElement;
    if (!element) return;
    
    currentOrderForm = new OrderForm(element, events);
    const buyerData = buyerModel.getBuyerData();
    
    if (buyerData.payment) currentOrderForm.payment = buyerData.payment;
    if (buyerData.address) currentOrderForm.address = buyerData.address;
    
    // Устанавливаем валидность на основе текущих данных модели
    currentOrderForm.valid = buyerModel.isOrderStepValid();
    
    modal.content = currentOrderForm.render();
    modal.open();
}

function openContactsForm() {
    const template = document.querySelector('#contacts') as HTMLTemplateElement;
    const element = template.content.firstElementChild?.cloneNode(true) as HTMLFormElement;
    if (!element) return;
    
    currentContactsForm = new ContactsForm(element, events);
    const buyerData = buyerModel.getBuyerData();
    
    if (buyerData.email) currentContactsForm.email = buyerData.email;
    if (buyerData.phone) currentContactsForm.phone = buyerData.phone;
    
    // Устанавливаем валидность на основе текущих данных модели
    currentContactsForm.valid = buyerModel.isContactsStepValid();
    
    modal.content = currentContactsForm.render();
    modal.open();
}

async function submitOrder() {
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
        
        const template = document.querySelector('#success') as HTMLTemplateElement;
        const element = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!element) return;
        
        const success = new Success(element, events);
        success.total = result.total;
        
        modal.content = success.render();
        
        basketModel.clear();
        buyerModel.clear();
        header.counter = basketModel.getCount();
        
        currentOrderForm = null;
        currentContactsForm = null;
        
    } catch (error) {
        console.error('Ошибка оформления заказа:', error);
    }
}

//НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ

// события от моделей данных
events.on('catalog:changed', () => {
    renderCatalog();
});

events.on('basket:countChanged', ({ count }: { count: number }) => {
    header.counter = count;
});

events.on('basket:cleared', () => {
    header.counter = 0;
});

// обработка валидации, здесь обновляется состояние кнопок форм
events.on('buyer:validationChanged', ({ errors }: { errors: TFormErrors }) => {
    // Для формы заказа (шаг 1)
    if (currentOrderForm) {
        currentOrderForm.valid = !errors.payment && !errors.address;
        const errorMessage = errors.payment || errors.address || '';
        currentOrderForm.errors = errorMessage;
    }
    
    // Для формы контактов (шаг 2)
    if (currentContactsForm) {
        currentContactsForm.valid = !errors.email && !errors.phone;
        const errorMessage = errors.email || errors.phone || '';
        currentContactsForm.errors = errorMessage;
    }
});

// События от представлений
events.on('card:select', ({ id }: { id: string }) => {
    const product = catalogModel.getItem(id);
    if (product) {
        openProductPreview(product);
    }
});

events.on('card:addToBasket', ({ id }: { id: string }) => {
    const product = catalogModel.getItem(id);
    if (product && product.price !== null) {
        basketModel.addItem(product);
    }
});

events.on('card:removeFromBasket', ({ id }: { id: string }) => {
    basketModel.removeItem(id);
});

events.on('basket:remove', ({ id }: { id: string }) => {
    basketModel.removeItem(id);
    modal.close();
    openBasket();
});

events.on('basket:open', () => {
    openBasket();
});

events.on('basket:order', () => {
    openOrderForm();
});

events.on('order.paymentChange', ({ payment }: { payment: 'card' | 'cash' }) => {
    buyerModel.setPayment(payment);
});

events.on('order.addressChange', ({ address }: { address: string }) => {
    buyerModel.setAddress(address);
});

events.on('order.submit', () => {
    if (buyerModel.isOrderStepValid()) {
        openContactsForm();
    }
});

events.on('contacts.emailChange', ({ email }: { email: string }) => {
    buyerModel.setEmail(email);
});

events.on('contacts.phoneChange', ({ phone }: { phone: string }) => {
    buyerModel.setPhone(phone);
});

events.on('contacts.submit', () => {
    if (buyerModel.isContactsStepValid() && basketModel.getCount() > 0) {
        submitOrder();
    }
});

events.on('success:close', () => {
    modal.close();
});

events.on('modal:close', () => {
    modal.content = document.createElement('div');
    currentOrderForm = null;
    currentContactsForm = null;
});

// загрузка товаров
async function loadProducts() {
    try {
        const products = await api.getProductList();
        catalogModel.setItems(products);
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
}

loadProducts();