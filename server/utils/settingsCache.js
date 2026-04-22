/**
 * Settings Cache Service
 * Caches loan configuration settings in memory with a TTL (Time To Live)
 * to avoid hitting the database on every validation request
 */

const settingsModel = require('../models/settingsModel');

class SettingsCache {
  constructor() {
    this.cache = {
      loanConfig: null,
      interestRates: null,
      lastUpdatedLoanConfig: null,
      lastUpdatedInterestRates: null,
      ttl: 5 * 60 * 1000, // 5 minutes in milliseconds
    };
  }

  /**
   * Get cached loan configuration
   * Fetches from database if cache is expired
   */
  async getLoanConfig() {
    const now = Date.now();
    
    // Return cached value if still valid
    if (
      this.cache.loanConfig &&
      this.cache.lastUpdatedLoanConfig &&
      now - this.cache.lastUpdatedLoanConfig < this.cache.ttl
    ) {
      console.log('📦 Returning cached loan config');
      return this.cache.loanConfig;
    }

    // Fetch fresh data from database
    try {
      console.log('🔄 Fetching fresh loan config from database');
      const config = await settingsModel.getLoanConfig();
      
      // Ensure numeric fields are properly parsed
      const normalizedConfig = {
        id: config.id,
        min_tenure: parseInt(config.min_tenure, 10) || 3,
        max_tenure: parseInt(config.max_tenure, 10) || 60,
        default_tenure: parseInt(config.default_tenure, 10) || 12,
        min_amount: parseFloat(config.min_amount) || 5000.00,
        max_amount: parseFloat(config.max_amount) || 1000000.00,
        emi_method: config.emi_method || 'Reducing Balance',
        late_fee: parseFloat(config.late_fee) || 200.00,
        penalty_rate: parseFloat(config.penalty_rate) || 2.00,
        grace_period: parseInt(config.grace_period, 10) || 3,
      };

      // Update cache
      this.cache.loanConfig = normalizedConfig;
      this.cache.lastUpdatedLoanConfig = now;

      return normalizedConfig;
    } catch (error) {
      console.error('❌ Error fetching loan config:', error.message);
      
      // Return default values on error
      return {
        id: 1,
        min_tenure: 3,
        max_tenure: 60,
        default_tenure: 12,
        min_amount: 5000.00,
        max_amount: 1000000.00,
        emi_method: 'Reducing Balance',
        late_fee: 200.00,
        penalty_rate: 2.00,
        grace_period: 3,
      };
    }
  }

  /**
   * Get cached interest rates
   * Fetches from database if cache is expired
   */
  async getInterestRates() {
    const now = Date.now();
    
    // Return cached value if still valid
    if (
      this.cache.interestRates &&
      this.cache.lastUpdatedInterestRates &&
      now - this.cache.lastUpdatedInterestRates < this.cache.ttl
    ) {
      console.log('📦 Returning cached interest rates');
      return this.cache.interestRates;
    }

    // Fetch fresh data from database
    try {
      console.log('🔄 Fetching fresh interest rates from database');
      const rates = await settingsModel.getInterestRates();
      
      // Ensure numeric fields are properly parsed
      const normalizedRates = {
        id: rates.id,
        default_rate: parseFloat(rates.default_rate) || 18.00,
        personal_rate: parseFloat(rates.personal_rate) || 18.00,
        business_rate: parseFloat(rates.business_rate) || 14.00,
        gold_rate: parseFloat(rates.gold_rate) || 12.00,
      };

      // Update cache
      this.cache.interestRates = normalizedRates;
      this.cache.lastUpdatedInterestRates = now;

      return normalizedRates;
    } catch (error) {
      console.error('❌ Error fetching interest rates:', error.message);
      
      // Return default values on error
      return {
        id: 1,
        default_rate: 18.00,
        personal_rate: 18.00,
        business_rate: 14.00,
        gold_rate: 12.00,
      };
    }
  }

  /**
   * Invalidate the cache (call this after settings are updated)
   */
  invalidate() {
    console.log('🗑️ Invalidating settings cache (loan config & interest rates)');
    this.cache.loanConfig = null;
    this.cache.interestRates = null;
    this.cache.lastUpdatedLoanConfig = null;
    this.cache.lastUpdatedInterestRates = null;
  }

  /**
   * Invalidate only loan config cache
   */
  invalidateLoanConfig() {
    console.log('🗑️ Invalidating loan config cache');
    this.cache.loanConfig = null;
    this.cache.lastUpdatedLoanConfig = null;
  }

  /**
   * Invalidate only interest rates cache
   */
  invalidateInterestRates() {
    console.log('🗑️ Invalidating interest rates cache');
    this.cache.interestRates = null;
    this.cache.lastUpdatedInterestRates = null;
  }

  /**
   * Set custom TTL (useful for testing)
   */
  setTTL(ms) {
    this.cache.ttl = ms;
  }
}

// Export singleton instance
module.exports = new SettingsCache();
