import { computed, onMounted, ref, watch } from 'vue';
// 商品数据
const products = ref([]);
// 绑定输入框
const newProductName = ref('');
// 初始化数据
onMounted(() => {
    const saved = localStorage.getItem('vue3-cart');
    if (saved) {
        products.value = JSON.parse(saved);
    }
    else {
        products.value = [
            { id: 1, name: '商品A', price: 10, count: 1 },
            { id: 2, name: '商品B', price: 15, count: 2 },
            { id: 3, name: '商品C', price: 20, count: 1 },
            { id: 4, name: '商品D', price: 25, count: 1 }
        ];
    }
});
// 监听变化，自动保存
watch(products, (newValue) => {
    localStorage.setItem('vue3-cart', JSON.stringify(newValue));
}, { deep: true });
// 添加新商品
const addProduct = () => {
    if (newProductName.value.trim()) {
        products.value.push({
            id: Date.now(), //简单生成唯一ID
            name: newProductName.value,
            price: Math.floor(Math.random() * 100) + 10, // 随机价格 10-110
            count: 1
        });
        newProductName.value = ''; //清空输入框
    }
};
// 增加数量
const increase = (id) => {
    const product = products.value.find(p => p.id === id);
    if (product)
        product.count++;
};
// 减少数量
const decrease = (id) => {
    const product = products.value.find(p => p.id === id);
    if (product && product.count > 1) {
        product.count--;
    }
    else if (product && product.count === 1) {
        if (confirm('删除这个商品？')) {
            removeProduct(id);
        }
    }
};
// 清空购物车
const clearCart = () => {
    if (confirm('确定清空购物车吗？')) {
        products.value = [];
    }
};
// 计算总价
const totalPrice = computed(() => {
    return products.value.reduce((sum, product) => {
        return sum + product.price * product.count;
    }, 0);
});
//封装localStorage 操作
const storage = {
    //存
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    //取
    get(key, defaultvalue = null) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultvalue;
    },
    //删
    remove(key) {
        localStorage.removeItem(key);
    }
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['add-product']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-add']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-decrease']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-increase']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-decrease']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-remove']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-clear']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "cart" },
});
/** @type {__VLS_StyleScopedClasses['cart']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "subtitle" },
});
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "add-product" },
});
/** @type {__VLS_StyleScopedClasses['add-product']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    placeholder: "输入商品名",
});
(__VLS_ctx.newProductName);
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.addProduct) },
    ...{ class: "btn-add" },
});
/** @type {__VLS_StyleScopedClasses['btn-add']} */ ;
if (__VLS_ctx.products.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "empty-cart" },
    });
    /** @type {__VLS_StyleScopedClasses['empty-cart']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({});
    for (const [product] of __VLS_vFor((__VLS_ctx.products))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
            key: (product.id),
            ...{ class: "cart-item" },
        });
        /** @type {__VLS_StyleScopedClasses['cart-item']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "product-info" },
        });
        /** @type {__VLS_StyleScopedClasses['product-info']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "product-name" },
        });
        /** @type {__VLS_StyleScopedClasses['product-name']} */ ;
        (product.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "product-price" },
        });
        /** @type {__VLS_StyleScopedClasses['product-price']} */ ;
        (product.price);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "quantity-control" },
        });
        /** @type {__VLS_StyleScopedClasses['quantity-control']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.products.length === 0))
                        return;
                    __VLS_ctx.decrease(product.id);
                    // @ts-ignore
                    [newProductName, addProduct, products, products, decrease,];
                } },
            disabled: (product.count <= 1),
            ...{ class: "btn-decrease" },
            title: "减少数量",
        });
        /** @type {__VLS_StyleScopedClasses['btn-decrease']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "quantity" },
        });
        /** @type {__VLS_StyleScopedClasses['quantity']} */ ;
        (product.count);
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.products.length === 0))
                        return;
                    __VLS_ctx.increase(product.id);
                    // @ts-ignore
                    [increase,];
                } },
            ...{ class: "btn-increase" },
            title: "增加数量",
        });
        /** @type {__VLS_StyleScopedClasses['btn-increase']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.products.length === 0))
                        return;
                    __VLS_ctx.removeProduct(product.id);
                    // @ts-ignore
                    [removeProduct,];
                } },
            ...{ class: "btn-remove" },
            title: "删除商品",
        });
        /** @type {__VLS_StyleScopedClasses['btn-remove']} */ ;
        // @ts-ignore
        [];
    }
}
if (__VLS_ctx.products.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "cart-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['cart-footer']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "total-section" },
    });
    /** @type {__VLS_StyleScopedClasses['total-section']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "total-label" },
    });
    /** @type {__VLS_StyleScopedClasses['total-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "total-amount" },
    });
    /** @type {__VLS_StyleScopedClasses['total-amount']} */ ;
    (__VLS_ctx.totalPrice);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.clearCart) },
        ...{ class: "btn-clear" },
    });
    /** @type {__VLS_StyleScopedClasses['btn-clear']} */ ;
}
// @ts-ignore
[products, totalPrice, clearCart,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
