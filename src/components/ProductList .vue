<script setup>
import QuantityControl from './QuantityControl.vue'

// 只接收必要的数据
const props = defineProps({
    products: {
        type: Array,
        required: true
    },
    isAllSelected: {  // 全选状态由父组件控制
        type: Boolean,
        default: false
    },
    editIndex: {  // 编辑状态
        type: Number,
        default: -1
    },
    editName: {  // 正在编辑的名称
        type: String,
        default: ''
    }
})

// 定义所有需要向上传递的事件
const emit = defineEmits([
    'handleToggleAll',
    'handleToggleSelect',
    'handleditItem',
    'handleSaveEdit',
    'handleIncrease',
    'handleDecrease',
    'handleRemove'
])

// 本地事件处理
const handleEditItem = (id, name) => {
    emit('handleditItem', id, name)
}
// 保存编辑
const handleSaveEdit = (id) => {
    emit('handleSaveEdit', id)
}
// 增加数量
const handleIncrease = (id) => {
    emit('handleIncrease', id)
}
// 减少数量
const handleDecrease = (id) => {
    emit('handleDecrease', id)
}
// 删除商品
const handleRemove = (id) => {
    emit('handleRemove', id)
}

</script>

<template>
    <!-- 全选区域移到 ul 外 -->
    <div class="select-all">
        <input type="checkbox" id="selectAll" :checked="isAllSelected"
            @change="emit('handleToggleAll', $event.target.checked)" />
        <label for="selectAll">全选</label>
    </div>

    <ul class="product-list">
        <li v-for="product in products" :key="product.id" class="cart-item">
            <div class="product-info">
                <!-- 复选框 -->
                <input type="checkbox" v-model="product.selected"
                    @change="emit('handleToggleSelect', product.id, product.selected)" />

                <!-- 商品名称和编辑 -->
                <div class="product-name">
                    <span v-if="editIndex === product.id">
                        <input :value="editName" @input="emit('update:editName', $event.target.value)"
                            @keyup.enter="handleSaveEdit(product.id)" @blur="handleSaveEdit(product.id)"
                            class="edit-input" />
                        <button @click="handleSaveEdit(product.id)">保存</button>
                    </span>
                    <span v-else @click="handleEditItem(product.id, product.name)" class="product-name-text">
                        {{ product.name }}
                    </span>
                </div>

                <!-- 价格 -->
                <span class="product-price">¥{{ product.price }}</span>

                <!-- 库存信息 -->
                <span class="text-sm product-stock" :class="{
                    'out': product.stock === 0,
                    'low': product.stock > 0 && product.stock <= 3,
                    'normal': product.stock > 3
                }">
                    库存：{{ product.stock }}
                    <span v-if="product.stock === 0">(售罄)</span>
                    <span v-else-if="product.stock <= 3">(紧张)</span>
                    <span v-else>(充足)</span>
                </span>
            </div>

            <!-- 数量控制器 -->
            <QuantityControl :product="product" @increase="handleIncrease(product.id)"
                @decrease="handleDecrease(product.id)" @remove="handleRemove(product.id)" />
        </li>
    </ul>
</template>

<style scoped>
.product-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.select-all {
    margin-bottom: 16px;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.product-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.product-name {
    min-width: 120px;
}

.product-name-text {
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.product-name-text:hover {
    background-color: #f5f5f5;
}

.edit-input {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 4px 8px;
    width: 120px;
}

.product-price {
    font-weight: bold;
    color: #f60;
    min-width: 60px;
}

/* 库存样式 */
.product-stock {
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 3px;
}

.product-stock.out {
    color: #f56c6c;
    background-color: #fee;
}

.product-stock.low {
    color: #e6a23c;
    background-color: #fdf6ec;
}

.product-stock.normal {
    color: #67c23a;
    background-color: #f0f9eb;
}
</style>