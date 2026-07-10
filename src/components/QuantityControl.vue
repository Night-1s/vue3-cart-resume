<script setup>
// 这个组件专注于显示单个商品的数量控制和删除功能
const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})
const emit = defineEmits(['increase', 'decrease', 'remove'])
</script>

<template>
    <div class="quantity-control">
        <!-- 减少数量 -->
        <button @click="emit('decrease', product.id)" :disabled="product.count <= 1" class="btn-decrease">
            -
        </button>
        <!-- 显示数量 -->
        <span class="quantity">数量：{{ product.count }}</span>
        <!-- 增加数量 -->
        <button @click="emit('increase', product.id)" :disabled="product.count >= product.stock || product.stock === 0"
            class="btn-increase" :title="product.stock === 0 ? '商品已售罄' : `最多可买${product.stock}件`">
            +
        </button>
        <!--删除商品按钮 -->
        <button @click="emit('remove', product.id)" class="btn-remove" title="删除商品">
            🗑️
        </button>
    </div>
</template>

<style scoped>
.quantity-control {
    display: flex;
    align-items: center;
    gap: 8px;
}

.quantity {
    min-width: 60px;
    text-align: center;
    font-weight: 500;
}

.btn-decrease,
.btn-increase {
    width: 32px;
    height: 32px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-decrease:hover:not(:disabled),
.btn-increase:hover {
    background: #f5f5f5;
}

.btn-decrease:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.btn-remove {
    width: 32px;
    height: 32px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-left: 8px;
}

.btn-remove:hover {
    background: #ffebee;
    border-color: #f44336;
    color: #f44336;
}
</style>