<script setup>
import { computed, onMounted, ref, watch } from 'vue';

// 商品数据
const products = ref([])
// 绑定输入框
const newProductName = ref('')

// 初始化数据
onMounted(() => {
  const saved = localStorage.getItem('vue3-cart')
  if (saved) {
    products.value = JSON.parse(saved)
  } else {
    products.value = [
      { id: 1, name: '商品A', price: 10, count: 1 },
      { id: 2, name: '商品B', price: 15, count: 2 },
      { id: 3, name: '商品C', price: 20, count: 1 },
      { id: 4, name: '商品D', price: 25, count: 1 }

    ]
  }
})

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
      count: 1
    });
    newProductName.value = '';//清空输入框
  }
}

// 增加数量
const increase = (id) => {
  const product = products.value.find(p => p.id === id)
  if (product) product.count++
}

// 减少数量
const decrease = (id) => {
  const product = products.value.find(p => p.id === id)
  if (product && product.count > 1) {
    product.count--
  } else if (product && product.count === 1) {
    if (confirm('删除这个商品？')) {
      removeProduct(id)
    }
  }
}

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
      <li v-for="product in products" :key="product.id" class="cart-item">
        <div class="product-info">
          <!-- 修改这里：移除了商品名和价格之间的"-" -->
          <span class="product-name">{{ product.name }}</span>
          <span class="product-price">¥{{ product.price }}</span>
        </div>

        <div class="quantity-control">
          <button @click="decrease(product.id)" :disabled="product.count <= 1" class="btn-decrease" title="减少数量">
            −
          </button>

          <span class="quantity">数量：{{ product.count }}</span>

          <button @click="increase(product.id)" class="btn-increase" title="增加数量">
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

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-weight: 500;
  font-size: 16px;
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