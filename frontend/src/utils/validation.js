// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Indonesian phone number validation
export const validateIndonesianPhone = (phone) => {
  const cleanPhone = phone.replace(/[\s-]/g, '');
  const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;
  return phoneRegex.test(cleanPhone);
};

// Balance validation
export const validateBalance = (balance, amount) => {
  return balance >= amount;
};

// Daily limit validation
export const validateDailyLimit = (amount, limit, usedToday = 0) => {
  return (usedToday + amount) <= limit;
};

// Format rupiah
export const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};