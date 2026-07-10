<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import QuantityControl from '../components/QuantityControl.vue';
import EmptyState from '../components/EmptyState.vue';

const router = useRouter();

// 商品数据
const products = ref([]);
const newProductName = ref('');

// 购物车商品（已选中的）
const cartItems = computed(() => {
  return products.value.filter(p => p.selected && p.count > 0);
});

const cartTotal = computed(() => {
  return cartItems.value.reduce((sum, product) => {
    return sum + product.price * product.count;
  }, 0);
});

const cartCount = computed(() => {
  return cartItems.value.reduce((sum, product) => {
    return sum + product.count;
  }, 0);
});

// 分类筛选
const currentCategory = ref('全部');
const categories = ['全部', '数码', '服饰', '食品', '家居'];

const filteredProducts = computed(() => {
  if (currentCategory.value === '全部') {
    return products.value;
  }
  return products.value.filter(p => p.category === currentCategory.value);
});

// 初始化数据
onMounted(() => {
  const saved = localStorage.getItem('ecommerce-cart');
  if (saved) {
    products.value = JSON.parse(saved);
  } else {
    products.value = [
      { id: 1, name: '无线蓝牙耳机', price: 299, count: 1, selected: false, stock: 10, category: '数码', image: '🎧' },
      { id: 2, name: '智能手表', price: 899, count: 1, selected: false, stock: 5, category: '数码', image: '⌚' },
      { id: 3, name: '纯棉T恤', price: 89, count: 1, selected: false, stock: 20, category: '服饰', image: '👕' },
      { id: 4, name: '休闲运动鞋', price: 259, count: 1, selected: false, stock: 8, category: '服饰', image: '👟' },
      { id: 5, name: '有机绿茶', price: 68, count: 1, selected: false, stock: 15, category: '食品', image: '🍵' },
      { id: 6, name: '坚果礼盒', price: 128, count: 1, selected: false, stock: 12, category: '食品', image: '🥜' },
      { id: 7, name: '北欧台灯', price: 199, count: 1, selected: false, stock: 6, category: '家居', image: '💡' },
      { id: 8, name: '记忆枕', price: 159, count: 1, selected: false, stock: 9, category: '家居', image: '🛏️' }
    ];
  }
});

// 监听变化，自动保存
watch(products, (newValue) => {
  localStorage.setItem('ecommerce-cart', JSON.stringify(newValue));
}, { deep: true });

// 添加新商品
const addProduct = () => {
  if (newProductName.value.trim()) {
    products.value.push({
      id: Date.now(),
      name: newProductName.value,
      price: Math.floor(Math.random() * 100) + 10,
      count: 1,
      stock: Math.floor(Math.random() * 10) + 1,
      category: '其他',
      image: '📦'
    });
    newProductName.value = '';
  }
};

// 添加到购物车
const addToCart = (product) => {
  if (product.count < product.stock) {
    product.count++;
  }
};

// 从购物车减少
const removeFromCart = (product) => {
  if (product.count > 1) {
    product.count--;
  } else {
    product.selected = false;
    product.count = 0;
  }
};

// 删除商品
const handleRemove = (productId) => {
  products.value = products.value.filter(p => p.id !== productId);
};

// 选择商品
const toggleSelect = (product) => {
  product.selected = !product.selected;
  if (!product.selected) {
    product.count = 0;
  }
};

// 跳转到购物车页面
const goToCart = () => {
  router.push('/cart');
};

// 库存监控
watch(products, (newValue) => {
  newValue.forEach(product => {
    if (product.stock === 0 && product.count > 0) {
      product.count = 0;
    }
  });
}, { deep: true });

// 模拟库存减少
onMounted(() => {
  setInterval(() => {
    const randomProduct = products.value[Math.floor(Math.random() * products.value.length)];
    if (randomProduct && randomProduct.stock > 0) {
      randomProduct.stock--;
    }
  }, 30000);
});
</script>

<template>
  <div class="homepage">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">🛍️ 优品商城</div>
        <div class="nav-links">
          <router-link to="/" class="nav-link active">首页</router-link>
          <router-link to="/cart" class="nav-link">购物车</router-link>
        </div>
        <div class="cart-icon" @click="goToCart">
          <span class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</span>
          🛒
        </div>
      </div>
    </nav>

    <!-- Banner -->
    <div class="banner">
      <div class="banner-content">
        <h1>欢迎来到优品商城</h1>
        <p>精选好物，品质生活</p>
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['tab', { active: currentCategory === cat }]"
        @click="currentCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- 添加商品区域 -->
    <div class="add-product-section">
      <h3>添加新商品</h3>
      <div class="add-product">
        <input v-model="newProductName" placeholder="输入商品名称" />
        <button @click="addProduct" class="btn-add">添加</button>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="products-container">
      <EmptyState v-if="filteredProducts.length === 0" />
      
      <div v-else class="products-grid">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          :class="['product-card', { selected: product.selected }]"
        >
          <div class="product-image" @click="toggleSelect(product)">
            <span class="emoji">{{ product.image }}</span>
            <div class="overlay" v-if="product.selected">
              <span class="checkmark">✓</span>
            </div>
          </div>
          
          <div class="product-info">
            <h3 class="product-name" @click="toggleSelect(product)">{{ product.name }}</h3>
            <div class="product-meta">
              <span class="category-tag">{{ product.category }}</span>
              <span :class="['stock', { low: product.stock <= 3, out: product.stock === 0 }]">
                库存: {{ product.stock }}
              </span>
            </div>
            
            <div class="product-bottom">
              <div class="price">¥{{ product.price }}</div>
              
              <div class="controls" v-if="product.selected">
                <QuantityControl :product="product" @increase="addToCart(product)" @decrease="removeFromCart(product)" @remove="handleRemove(product.id)" />
              </div>
              <button
                v-else
                class="btn-add-cart"
                :disabled="product.stock === 0"
                @click="toggleSelect(product)"
              >
                {{ product.stock === 0 ? '已售罄' : '加入购物车' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部购物车栏 -->
    <div class="bottom-cart" v-if="cartCount > 0">
      <div class="cart-info">
        <label>
          <input type="checkbox" :checked="cartCount > 0" disabled />
          已选 {{ cartCount }} 件商品
        </label>
        <span class="total">合计: ¥{{ cartTotal.toFixed(2) }}</span>
      </div>
      <button class="btn-go-cart" @click="goToCart">去结算 ({{ cartCount }})</button>
    </div>
  </div>
</template>

<style scoped>
.homepage {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 导航栏 */
.navbar {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s;
}

.nav-link:hover,
.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.cart-icon {
  font-size: 24px;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s;
}

.cart-icon:hover {
  transform: scale(1.1);
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ffd700;
  color: #333;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

/* Banner */
.banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.banner h1 {
  font-size: 36px;
  margin-bottom: 10px;
}

.banner p {
  font-size: 18px;
  opacity: 0.9;
}

/* 分类标签 */
.category-tabs {
  background: white;
  padding: 15px 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tab {
  padding: 8px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.tab:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.tab.active {
  background: #ff6b6b;
  color: white;
  border-color: #ff6b6b;
}

/* 添加商品区域 */
.add-product-section {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.add-product-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.add-product {
  display: flex;
  gap: 10px;
}

.add-product input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.btn-add {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.btn-add:hover {
  background: #45a049;
}

/* 商品网格 */
.products-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px 120px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-card.selected {
  border: 2px solid #ff6b6b;
}

.product-image {
  height: 200px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.emoji {
  font-size: 80px;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 107, 107, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkmark {
  background: white;
  color: #ff6b6b;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.product-info {
  padding: 15px;
}

.product-name {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
  cursor: pointer;
}

.product-name:hover {
  color: #ff6b6b;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.category-tag {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  color: #666;
}

.stock {
  font-size: 12px;
  color: #666;
}

.stock.low {
  color: #e6a23c;
}

.stock.out {
  color: #f56c6c;
  text-decoration: line-through;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 20px;
  font-weight: bold;
  color: #ff6b6b;
}

.btn-add-cart {
  padding: 8px 16px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-add-cart:hover:not(:disabled) {
  background: #ee5a24;
}

.btn-add-cart:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 底部购物车栏 */
.bottom-cart {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 99;
}

.cart-info {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 16px;
}

.cart-info label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.total {
  font-size: 20px;
  font-weight: bold;
  color: #ff6b6b;
}

.btn-go-cart {
  padding: 12px 30px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.3s;
}

.btn-go-cart:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }
  
  .banner h1 {
    font-size: 24px;
  }
  
  .bottom-cart {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
