<script setup>
import { computed, onMounted, ref, watch } from 'vue';

// 商品数据
const products = ref([])
// 绑定输入框
const newProductName = ref('')

// 初始化数据
onMounted(() => {
  const saved = localStorage.getItem('vue3-cart')
  // 如果有保存的数据，就加载，否则使用模拟数据
  if (saved) {
    products.value = JSON.parse(saved)
  }
  // 模拟初始数据
  else {
    products.value = [
      { id: 1, name: '商品A', price: 10, count: 1, selected: false, stock: 8 },
      { id: 2, name: '商品B', price: 15, count: 2, selected: false, stock: 3 },
      { id: 3, name: '商品C', price: 20, count: 1, selected: false, stock: 2 },
      { id: 4, name: '商品D', price: 25, count: 1, selected: false, stock: 5 }

    ]
  }
})
//模拟购物车库存减少
onMounted(() => {
  //每隔10秒随机减少一个商品的库存，模拟库存变化
  setInterval(() => {
    // 随机选择一个商品
    const randomProduct = products.value[Math.floor(Math.random() * products.value.length)]
    if (randomProduct.stock > 0) {
      randomProduct.stock-- // 模拟库存减少
    }
  }, 10000) // 每10秒更新一次库存
})

//监听库存变化，为0时删除购买数量
watch(products, (newValue) => {
  newValue.forEach(product => {
    if (product.stock === 0) {
      product.count = 0 // 库存为0时，购买数量也设为0
    }
  })
}, { deep: true })

//编辑相关
const editIndex = ref(-1)//-1表示没有正在编辑的任何项
const editName = ref('')//编辑时临时存入输入的内容

// 开始编辑
const editItem = (index, name) => {
  editIndex.value = index
  editName.value = name
}

// 保存编辑
const saveEdit = (id) => {
  if (!editName.value.trim()) return//如果输入为空，则不保存
  const product = products.value.find(p => p.id === id)
  product.name = editName.value.trim()//更新商品名称
  editIndex.value = -1//退出编辑状态
}
// 监听变化，自动保存
watch(products, (newValue) => {
  localStorage.setItem('vue3-cart', JSON.stringify(newValue))
}, { deep: true })

// 添加新商品
const addProduct = () => {
  if (newProductName.value.trim()) {
    products.value.push({
      id: Date.now(),//简单生成唯一ID
      name: newProductName.value,
      price: Math.floor(Math.random() * 100) + 10,// 随机价格 10-110
      count: 1,
      stock: Math.floor(Math.random() * 10) + 1 // 库存 1-10
    });
    newProductName.value = '';//清空输入框
  }
}

// 增加数量
const increase = (id) => {
  const product = products.value.find(p => p.id === id)
  if (product) {
    product.count++
  }

}

// 减少数量
const decrease = (id) => {
  const product = products.value.find(p => p.id === id)
  if (product && product.count > 1) {
    product.count--
  }
}
// 单个商品删除
const removeProduct = (id) => {
  if (!confirm('确定要删除这个商品吗？')) return
  products.value = products.value.filter(p => p.id !== id)
  console.log('删除后剩余商品：', products.value) // 调试用
}

//全选
const isAllSelected = computed({
  get() {
    return products.value.length > 0 && products.value.every(p => p.selected)
  },
  set(value) {
    products.value.forEach(p => p.selected = value)
  }
})

// 清空购物车
const clearCart = () => {
  if (confirm('确定清空购物车吗？')) {
    products.value = []
  }
}

// 计算总价
const totalPrice = computed(() => {
  return products.value.reduce((sum, product) => {
    return sum + product.price * product.count
  }, 0)
})

//封装localStorage 操作
const storage = {
  //存
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  //取
  get(key, defaultvalue = null) {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : defaultvalue
  },
  //删
  remove(key) {
    localStorage.removeItem(key)
  }
}

</script>

<template>
  <div class="cart">
    <header>
      <h1>🛒 Vue 3 购物车</h1>
      <p class="subtitle">一个演示 Vue 3 响应式与 Composition API 的实战项目</p>
    </header>

    <!-- 添加商品区域 -->
    <div class="add-product">
      <input v-model="newProductName" placeholder="输入商品名" />
      <button @click="addProduct" class="btn-add">添加商品</button>
    </div>

    <!-- 空状态提示 -->
    <div v-if="products.length === 0" class="empty-cart">
      购物车是空的，快去添加商品吧！
    </div>

    <!-- 商品列表 -->
    <ul v-else>
      <div class="select-all">
        <input type="checkbox" id="selectAll" v-model="isAllSelected" />
        <label for="selectAll">全选</label>
      </div>
      <li v-for="product in products" :key="product.id" class="cart-item">
        <div class="product-info">
          <input type="checkbox" v-model="product.selected" v-if="editIndex !== product.id" />
          <div class="product-name">
            <span v-if="editIndex === product.id">
              <input v-model="editName" @keyup.enter="saveEdit(product.id)" @blur="saveEdit(product.id)" />
              <button @click="saveEdit(product.id)">保存</button>
            </span>
            <span class="edit-section" v-else @click="editItem(product.id, product.name)">
              {{ product.name }}
            </span>
          </div>
          <span class="product-price">¥{{ product.price }}</span>
          <!-- 库存信息显示 -->
          <span class="text-sm product-stock" :class="{
            'product-stock out': product.stock === 0,      // 售罄
            'product-stock low': product.stock > 0 && product.stock <= 3, // 紧张
            'product-stock normal': product.stock > 3      // 充足
          }">
            库存：{{ product.stock }}
            <span v-if="product.stock === 0">(售罄)</span>
            <span v-else-if="product.stock <= 3">(紧张)</span>
            <span v-else>(充足)</span>
          </span>
        </div>

        <div class="quantity-control">
          <button @click="decrease(product.id)" :disabled="product.count <= 1" class="btn-decrease">
            -
          </button>
          <span class="quantity">数量：{{ product.count }}</span>
          <button @click="increase(product.id)" :disabled="product.count >= product.stock || product.stock === 0"
            class="btn-increase" :title="product.stock === 0 ? '商品已售罄' : `最多可买${product.stock}件`">
            +
          </button>

          <button @click="removeProduct(product.id)" class="btn-remove" title="删除商品">
            🗑️
          </button>
        </div>
      </li>
    </ul>

    <!-- 总计区域 -->
    <div v-if="products.length > 0" class="cart-footer">
      <div class="total-section">
        <div class="total-label">总价：</div>
        <div class="total-amount">¥{{ totalPrice }}</div>
      </div>
      <button @click="clearCart" class="btn-clear">清空购物车</button>
    </div>
  </div>
</template>

<style scoped>
.cart {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: white;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 0.9rem;
}

.add-product {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}


.add-product input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.btn-add {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-add:hover {
  background: #45a049;
}

.empty-cart {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 18px;
}

.product-name {
  display: flex;
  gap: 8px;
  font-weight: 500;
  font-size: 16px;
  color: #333;
  flex: 1;
  cursor: pointer;
}

/* 库存样式 */
.product-stock {
  font-size: 12px;
  color: #666;
  margin-left: 8px;
}

/* 库存紧张样式 */
.product-stock.low {
  color: #e6a23c;
  /* 橙色警告 */
  font-weight: 500;
}

/* 库存充足样式 */
.product-stock.normal {
  color: #67c23a;
  /* 绿色 */
}

/* 无库存样式 */
.product-stock.out {
  color: #f56c6c;
  /* 红色 */
  text-decoration: line-through;
}

.stock-tip {
  font-size: 11px;
  color: inherit;
  opacity: 0.8;
}

/* 禁用状态 */
.btn-increase:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.select-all input[type="checkbox"] {
  margin-bottom: 10px;
  cursor: pointer;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  gap: 4px;
}

.product-info input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.product-price {
  color: #f60;
  font-size: 18px;
  font-weight: bold;
}

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

.cart-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-section {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.total-label {
  font-size: 18px;
  color: #666;
}

.total-amount {
  font-size: 24px;
  color: #f60;
  font-weight: bold;
}

.btn-clear {
  padding: 10px 20px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-clear:hover {
  background: #d32f2f;
}
</style>