// Site deployment configuration
export const SITE_DEPLOYMENT_TYPE = process.env.SITE_DEPLOYMENT_TYPE || 'alpha';
export const DATABASE_URL = process.env.DATABASE_URL

export const isProductionSite = () => SITE_DEPLOYMENT_TYPE === 'production';
export const isAlphaSite = () => SITE_DEPLOYMENT_TYPE === 'alpha';

// Alpha site configuration
export const ALPHA_CONFIG = {
  guestRecipes: ['cat-olympic-diving', 'lava-food-asmr', 'based-ape-vlog'],
  typeformUrl: process.env.ALPHA_TYPEFORM_URL || 'https://typeform.com/to/placeholder',
  siteName: 'delula',
  logoUrl: process.env.ALPHA_LOGO_URL || '/delula-logo.svg'
};
