<template>
    <div class="construction-container">
        <div class="construction-content">
            <div class="construction-icon">🚧</div>
            <h1 class="construction-title">{{ $t('inConstruction.title') }}</h1>
            <p class="construction-message">
                {{ $t('inConstruction.message')}}
            </p>
            <div class="construction-animation">
                <div class="construction-bar"></div>
                <div class="construction-bar"></div>
                <div class="construction-bar"></div>
            </div>
            <p class="construction-note">
                {{ $t('inConstruction.note')}}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">


</script>

<style scoped>
.construction-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
    padding: 2rem;
    background: transparent;
}

.construction-content {
    text-align: center;
    max-width: 500px;
    background: var(--surface);
    padding: 3rem 2rem;
    border-radius: 20px;
    border: 2px solid var(--border);
    box-shadow: 0 8px 25px var(--shadow);
    transition: all 0.3s ease;
}

.construction-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    animation: bounce 2s infinite;
    filter: grayscale(0.3);
}

.construction-title {
    color: var(--primary);
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-family: 'Sour Gummy', sans-serif;
    text-shadow: 1px 1px 2px var(--text-shadow);
}

.construction-message {
    color: var(--text-secondary);
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    font-weight: 500;
}

.construction-animation {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
}

.construction-bar {
    width: 12px;
    height: 40px;
    background: linear-gradient(135deg, var(--turquoise-50), var(--rose-50));
    border-radius: 6px;
    animation: construction 1.4s ease-in-out infinite;
    box-shadow: 0 2px 8px var(--shadow);
}

.construction-bar:nth-child(2) {
    animation-delay: -0.16s;
}

.construction-bar:nth-child(3) {
    animation-delay: -0.32s;
}

.construction-note {
    color: var(--text-muted);
    font-style: italic;
    font-size: 1rem;
    opacity: 0.8;
}


@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-10px);
    }
    60% {
        transform: translateY(-5px);
    }
}

@keyframes construction {
    0%, 80%, 100% {
        transform: scaleY(0.6);
        opacity: 0.7;
    }
    40% {
        transform: scaleY(1.2);
        opacity: 1;
    }
}

.construction-content:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px var(--shadow);
}

.construction-content:hover .construction-icon {
    filter: grayscale(0);
}


@media (max-width: 768px) {
    .construction-container {
        padding: 1rem;
    }
    
    .construction-content {
        padding: 2rem 1.5rem;
        margin: 1rem;
    }
    
    .construction-title {
        font-size: 2rem;
    }
    
    .construction-message {
        font-size: 1.1rem;
    }
    
    .construction-icon {
        font-size: 3rem;
    }
}

@media (max-width: 480px) {
    .construction-content {
        padding: 1.5rem 1rem;
    }
    
    .construction-title {
        font-size: 1.8rem;
    }
    
    .construction-message {
        font-size: 1rem;
    }
    
    .construction-bar {
        width: 10px;
        height: 35px;
    }
}
</style>