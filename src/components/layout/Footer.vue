<template>
    <footer>
        <div class="footer-container">
            <div class="footer-grid">
                <div class="footer-column social-links">
                    <Tooltip :content="$t('footer.toolTip.github')" position="top">
                        <a href="https://github.com/mochiemi/mochi-lab" target="_blank" class="social-link github">
                        <OhVueIcon name="fa-github" />
                        </a>
                    </Tooltip>
                    <Tooltip :content="$t('footer.toolTip.linkedin')" position="top">
                        <a href="https://www.linkedin.com/in/juliana-tiemi-suyama-ab88b7b3" target="_blank" class="social-link linkedin">
                            <OhVueIcon name="fa-linkedin" />
                        </a>
                    </Tooltip>
                    <Tooltip :content="$t('footer.toolTip.portfolio')" position="top">
                        <a href="https://tiemi-suyama.netlify.app/" target="_blank" class="social-link portfolio">
                            <Mochilogo size="small" class="mochilogo"/>
                        </a>
                    </Tooltip>
                </div> 
                
                <div class="footer-column center-column">
                    <p class="copyright-text">
                        &copy; 2025-{{ currentYear }} Mochi Lab 
                        <a href="mailto:tiemi.suyama@gmail.com" class="email-link">tiemi.suyama@gmail.com</a>
                    </p>
                </div>
                
                <div class="footer-column right-column">
                    <div class="quick-links">
                        <div class="quick-links-list">
                            <router-link to="/" class="quick-link-text">{{ $t('nav.home') }}</router-link>
                            <span class="quick-link-separator">•</span>
                            <router-link to="/blog" class="quick-link-text">{{ $t('nav.blog') }}</router-link>
                            <span class="quick-link-separator">•</span>
                            <router-link to="/about" class="quick-link-text">{{ $t('nav.aboutThis') }}</router-link>
                            <span class="quick-link-separator">•</span>
                            <router-link to="/contact" class="quick-link-text">{{ $t('nav.contact') }}</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { OhVueIcon } from 'oh-vue-icons';
import { ref } from 'vue';
import Mochilogo from '@/components/misc/Logo.vue'
import Tooltip from '../ui/Tooltip.vue';

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.footer-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 80px;
    background-color: var(--bg-navbar);
    padding: 1rem 0;
    border-top: 1px solid var(--rose);
}

.footer-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    padding: 0 2em;
    gap: 1em;
}

.footer-column {
    display: flex;
    align-items: center;
}

.center-column {
    justify-content: center;
    text-align: center;
}

.right-column {
    justify-content: flex-end;
}

.social-links {
    justify-content: flex-start;
    gap: 1em;
}

.quick-links {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: flex-end;
}

.quick-links-title {
    color: var(--title-secondary);
    font-family: "Shantell Sans", cursive;
    font-size: 0.9rem;
    font-weight: 600;
    white-space: nowrap;
}

.quick-links-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.quick-link-text {
    color: var(--link-footer);
    font-family: 'Comfortaa', sans-serif;
    font-size: 0.85rem;
    text-decoration: none;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.quick-link-text:hover {
    color: var(--text-primary);
    text-decoration: underline;
    transform: translateY(-1px);
}

.quick-link-separator {
    color: var(--border-strong);
    font-size: 0.8rem;
    opacity: 0.7;
}

.copyright-text {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.9em;
}

.email-link {
    color: var(--link-footer);
    font-family: 'Comfortaa', sans-serif;
    letter-spacing: 1px;
    text-decoration: none;
    margin-left: 0.5em;
    transition: all 0.5s ease;
    position: relative;
}

.email-link:hover {
    color: var(--text-primary);
    text-decoration: underline;
    transform: translateY(-2px);
}

.social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.8s ease;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: transparent;
    position: relative;
    overflow: hidden;
}

.social-link:hover {
    color: var(--white);
    transform: scale(1.1);
    box-shadow: 
        0 10px 20px var(--shadow),
        0 6px 6px var(--shadow-hover);
}

.social-link:hover {
    background-color: var(--inner-surface);
    opacity: 0.8;
}

.social-link:active {
    transform: scale(1.05);
    transition: all 0.2s ease;
}

.social-link:deep(svg), .mochilogo:deep(svg) {
    width: 24px;
    height: 24px;
    color: var(--text-secondary) !important;
    transition: all 0.5s ease-out;
}

.social-link:hover:deep(svg), .mochilogo:deep(svg) {
    transform: scale(1.2);
    color: var(--secondary) !important;
}

@media (max-width: 768px) {
    .footer-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
        gap: 1.5rem;
        text-align: center;
    }
    
    .footer-column {
        justify-content: center;
    }
    
    .social-links {
        justify-content: center;
        gap: 1rem;
    }
    
    .right-column {
        justify-content: center;
    }
    
    .quick-links {
        justify-content: center;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .quick-links-list {
        justify-content: center;
    }
    
    .copyright-text {
        font-size: 0.8rem;
    }
    
    .social-link {
        width: 40px;
        height: 40px;
    }
    
    .social-link:deep(svg) {
        width: 25px;
        height: 25px;
    }
}

@media (max-width: 480px) {
    .quick-links-list {
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .quick-link-separator {
        display: none;
    }
    
    .quick-link-text {
        padding: 0.25rem 0;
    }
}
</style>