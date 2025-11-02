<template>
    <footer>
        <div class="footer-container">
            <div class="footer-grid">
                <div class="footer-column social-links">
                    <a href="https://github.com/mochiemi/mochi-lab" target="_blank" class="social-link github">
                        <OhVueIcon name="fa-github" />
                        <span class="social-tooltip">GitHub</span>
                    </a>
                    <a href="https://www.linkedin.com/in/juliana-tiemi-suyama-ab88b7b3" target="_blank" class="social-link linkedin">
                        <OhVueIcon name="fa-linkedin" />
                        <span class="social-tooltip">LinkedIn</span>
                    </a>
                    <a href="https://cronicamenteindecisa.blogspot.com/" target="_blank" class="social-link blogger">
                        <OhVueIcon name="fa-blogger" />
                        <span class="social-tooltip">Blog</span>
                    </a>
                </div> 
                <div class="footer-column center-column">
                    <p class="copyright-text">
                        &copy; {{ currentYear }} Mochi Lab
                        <a href="mailto:tiemi.suyama@gmail.com" class="email-link">tiemi.suyama@gmail.com</a>
                    </p>
                </div>
                <div class="footer-column"></div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { OhVueIcon } from 'oh-vue-icons';
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.footer-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 80px;
    background-color: var(--gradient-surface-2);
    padding: 1rem 0;
    border-top: 1px solid var(--border);
}

.footer-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    padding: 0 2rem;
    gap: 1rem;
}

.footer-column {
    display: flex;
    align-items: center;
}

.center-column {
    justify-content: center;
    text-align: center;
}

.social-links {
    justify-content: flex-start;
    gap: 1rem;
}

.copyright-text {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.email-link {
    color: var(--link-color);
    text-decoration: none;
    margin-left: 0.5rem;
    transition: all 0.5s ease;
    position: relative;
}

.email-link:hover {
    color: var(--link-hover);
    text-decoration: underline;
    transform: translateY(-1px);
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

.social-link::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, var(--surface), transparent);
    transition: left 0.5s ease;
    opacity: 0.3;
}

.social-link:hover::before {
    left: 100%;
}

.social-link:hover {
    color: var(--white);
    transform: translateY(-5px) scale(1.1);
    box-shadow: 
        0 10px 20px var(--shadow),
        0 6px 6px var(--shadow-hover);
}

.social-link:hover {
    background-color: var(--gradient-mix);
}

.social-link:active {
    transform: translateY(-2px) scale(1.05);
    transition: all 0.2s ease;
}

.social-link:deep(svg) {
    width: 24px;
    height: 24px;
    color: var(--text-secondary);
    transition: all 0.5s ease-out;
}

.social-link:hover:deep(svg) {
    transform: rotate(360deg) scale(1.2);
    color: var(--accent);
}


@keyframes pulse-glow {
    0% {
        box-shadow: 0 0 0 0 var(--shadow);
    }
    70% {
        box-shadow: 0 0 0 8px transparent;
    }
    100% {
        box-shadow: 0 0 0 0 transparent;
    }
}

.social-link:hover {
    animation: pulse-glow 1.5s infinite;
}


.social-tooltip {
    position: absolute;
    bottom: -35px;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: var(--surface);
    color: var(--text-primary);
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.75rem;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    pointer-events: none;
    border: 1px solid var(--border);
    box-shadow: 0 4px 12px var(--shadow);
}

.social-tooltip::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid var(--surface);
}

.social-link:hover .social-tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
}


@keyframes bounce-in {
    0% {
        opacity: 0;
        transform: scale(0.3);
    }
    50% {
        opacity: 1;
        transform: scale(1.05);
    }
    70% {
        transform: scale(0.9);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.social-link {
    animation: bounce-in 0.6s ease both;
}

.social-link.github {
    animation-delay: 0.1s;
}

.social-link.linkedin {
    animation-delay: 0.2s;
}

.social-link.blogger {
    animation-delay: 0.3s;
}


@media (max-width: 768px) {
    .footer-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
        gap: 1rem;
        text-align: center;
    }
    
    .footer-column {
        justify-content: center;
    }
    
    .social-links {
        justify-content: center;
        gap: 1rem;
    }
    
    .copyright-text {
        font-size: 0.8rem;
    }
    
    .social-link {
        width: 45px;
        height: 45px;
    }
    
    .social-link:deep(svg) {
        width: 20px;
        height: 20px;
    }
}
</style>