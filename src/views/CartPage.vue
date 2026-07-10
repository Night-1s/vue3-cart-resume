<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import EmptyState from '../components/EmptyState.vue';

const router = useRouter();
const products = ref([]);

// 已选中的商品（selected为true且count>0）
const selectedProducts = computed(() => {
  return products.value.filter(p => p.selected && p.count > 0);
});

const totalPrice = computed(() => {
  return selectedProducts.value.reduce((sum, product) => {
    return sum + product.price * product.count;
  }, 0);
});

const totalCount = computed(() => {
  return selectedProducts.value.reduce((sum, product) => {
    return sum + product.count;
  }, 0);
});

// 全选状态
const isAllSelected = computed({
  get() {
    if (products.value.length === 0) return false;
    return products.value.every(p => p.selected);
  },
  set(value) {
    products.value.forEach(p => {
      p.selected = value;
      // 全选时，如果count为0则设为1
      if (value && p.count === 0 && p.stock > 0) {
        p.count = 1;
      }
    });
  }
});

// 初始化
onMounted(() => {
  const saved = localStorage.getItem('ecommerce-cart');
  if (saved) {
    products.value = JSON.parse(saved);
  } else {
    products.value = [];
  }
});

// 监听变化
watch(products, (newValue) => {
  localStorage.setItem('ecommerce-cart', JSON.stringify(newValue));
}, { deep: true });

// 返回商城
const backToShop = () => {
  router.push('/');
};

// 单个商品选择切换
const toggleSelect = (product) => {
  product.selected = !product.selected;
  // 选中时如果数量为0，设为1
  if (product.selected && product.count === 0 && product.stock > 0) {
    product.count = 1;
  }
  // 取消选中时不清空数量
};

// 增加数量
const handleIncrease = (product) => {
  if (product.count < product.stock) {
    product.count++;
  }
};

// 减少数量
const handleDecrease = (product) => {
  if (product.count > 1) {
    product.count--;
  }
};

// 从购物车移除（取消选中）
const handleRemove = (product) => {
  product.selected = false;
  product.count = 0;
};

// 清空购物车
const clearCart = () => {
  if (confirm('确定要清空购物车吗？')) {
    products.value.forEach(p => {
      p.selected = false;
      p.count = 0;
    });
  }
};

// 结算
const checkout = () => {
  alert(`订单提交成功！共 ${totalCount.value} 件商品，总计 ¥${totalPrice.value.toFixed(2)}`);
};
</script>

<template>
  <div class="cart-page">
    <!-- 顶部导航 -->
    <nav class="cart-navbar">
      <div class="nav-container">
        <div class="logo">🛍️ 优品商城</div>
        <button class="btn-back" @click="backToShop">← 继续购物</button>
      </div>
    </nav>

    <!-- 购物车标题 -->
    <div class="cart-header">
      <h2>我的购物车</h2>
      <span class="item-count">{{ totalCount }} 件商品</span>
    </div>

    <!-- 购物车内容 -->
    <div class="cart-content">
      <EmptyState v-if="products.length === 0" />

      <div v-else-if="selectedProducts.length === 0" class="empty-cart-msg">
        <p>购物车是空的，快去挑选商品吧！</p>
        <button class="btn-go-shop" @click="backToShop">去逛逛</button>
      </div>

      <div v-else class="cart-items">
        <!-- 全选 -->
        <div class="cart-select-all">
          <input type="checkbox" v-model="isAllSelected" id="selectAll" />
          <label for="selectAll">全选</label>
        </div>

        <!-- 商品列表 -->
        <div v-for="product in products" :key="product.id" class="cart-item" :class="{ selected: product.selected }">
          <div class="item-checkbox">
            <input type="checkbox" :checked="product.selected" @change="toggleSelect(product)" />
          </div>

          <div class="item-image" v-if="product.selected">
            <span class="emoji">{{ product.image }}</span>
          </div>

          <div class="item-details" v-if="product.selected">
            <h3>{{ product.name }}</h3>
            <div class="item-meta">
              <span class="category">{{ product.category }}</span>
              <span :class="['stock', { low: product.stock <= 3 }]">
                库存: {{ product.stock }}
              </span>
            </div>
          </div>

          <div class="item-price" v-if="product.selected">
            ¥{{ product.price }}
          </div>

          <div class="item-quantity" v-if="product.selected">
            <button @click="handleDecrease(product)" :disabled="product.count <= 1" class="btn-decrease">-</button>
            <span class="count">{{ product.count }}</span>
            <button @click="handleIncrease(product)" :disabled="product.count >= product.stock"
              class="btn-increase">+</button>
          </div>

          <div class="item-total" v-if="product.selected">
            ¥{{ (product.price * product.count).toFixed(2) }}
          </div>

          <button class="btn-remove" v-if="product.selected" @click="handleRemove(product)">×</button>
        </div>
      </div>
    </div>

    <!-- 结算栏 -->
    <div class="checkout-bar" v-if="selectedProducts.length > 0">
      <div class="checkout-info">
        <input type="checkbox" v-model="isAllSelected" id="checkoutSelectAll" />
        <label for="checkoutSelectAll">全选</label>
        <span class="total-count">已选 {{ totalCount }} 件</span>
      </div>

      <div class="checkout-actions">
        <button class="btn-clear" @click="clearCart">清空购物车</button>
        <div class="total-price">
          合计: <span class="price">¥{{ totalPrice.toFixed(2) }}</span>
        </div>
        <button class="btn-checkout" @click="checkout">去结算</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 导航栏 */
.cart-navbar {
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

.btn-back {
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-back:hover {
  background: white;
  color: #ff6b6b;
}

/* 购物车标题 */
.cart-header {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-header h2 {
  font-size: 28px;
  color: #333;
}

.item-count {
  color: #666;
  font-size: 16px;
}

/* 购物车内容 */
.cart-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 150px;
}

.empty-cart-msg {
  background: white;
  padding: 60px;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-cart-msg p {
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
}

.btn-go-shop {
  padding: 12px 30px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-go-shop:hover {
  background: #ee5a24;
}

/* 全选 */
.cart-select-all {
  background: white;
  padding: 15px 20px;
  border-radius: 12px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cart-select-all input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.cart-select-all label {
  font-size: 16px;
  color: #333;
  cursor: pointer;
}

/* 商品项 */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.cart-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cart-item.selected {
  border: 2px solid #ff6b6b;
}

.cart-item:not(.selected) {
  opacity: 0.5;
}

.item-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.item-image {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-image .emoji {
  font-size: 50px;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.item-meta {
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: #666;
}

.category {
  background: #f0f0f0;
  padding: 2px 10px;
  border-radius: 10px;
}

.stock.low {
  color: #e6a23c;
}

.item-price {
  font-size: 20px;
  font-weight: bold;
  color: #ff6b6b;
  min-width: 80px;
  text-align: center;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
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
  transition: all 0.3s;
}

.btn-decrease:hover:not(:disabled),
.btn-increase:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.btn-decrease:disabled,
.btn-increase:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.count {
  min-width: 30px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.item-total {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  min-width: 100px;
  text-align: right;
}

.btn-remove {
  width: 32px;
  height: 32px;
  border: none;
  background: #ffebee;
  color: #f44336;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-remove:hover {
  background: #f44336;
  color: white;
}

/* 结算栏 */
.checkout-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  z-index: 99;
}

.checkout-info {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 15px;
}

.checkout-info input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkout-info label {
  font-size: 16px;
  cursor: pointer;
}

.total-count {
  color: #666;
  font-size: 14px;
}

.checkout-actions {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
}

.btn-clear {
  padding: 8px 20px;
  background: white;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-clear:hover {
  border-color: #f44336;
  color: #f44336;
}

.total-price {
  font-size: 16px;
  color: #333;
}

.total-price .price {
  font-size: 24px;
  font-weight: bold;
  color: #ff6b6b;
  margin-left: 5px;
}

.btn-checkout {
  padding: 12px 40px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.3s;
}

.btn-checkout:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .cart-item {
    flex-wrap: wrap;
  }

  .item-price,
  .item-total {
    min-width: auto;
  }
}
</style>