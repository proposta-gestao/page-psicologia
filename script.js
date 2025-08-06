/* ========================================
   SCRIPT JAVASCRIPT - @LINKPSICOLOGIA
   Arquivo responsável por todas as funcionalidades interativas do site
   ======================================== */

/* ========================================
   NAVEGAÇÃO MOBILE - MENU HAMBÚRGUER
   ======================================== */


/* ========================================
   FUNCIONALIDADE DO ACCORDION (MENU SANFONADO)
   ======================================== */

/**
 * Função para alternar a abertura/fechamento dos itens do accordion
 * Utilizada na seção de análise de concorrentes para organizar o conteúdo
 * @param {HTMLElement} element - O elemento header clicado (cabeçalho do accordion)
 */
function toggleAccordion(element) {
    // Obtém o item pai do accordion (div que contém header + content)
    const accordionItem = element.parentElement;
    
    // Verifica se o item atual já está ativo (aberto)
    const isActive = accordionItem.classList.contains('active');
    
    // Fecha todos os itens do accordion antes de abrir o selecionado
    // Isso garante que apenas um item fique aberto por vez
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Abre o item clicado apenas se não estava ativo anteriormente
    // Se já estava aberto, permanece fechado (comportamento toggle)
    if (!isActive) {
        accordionItem.classList.add('active');
    }
}

/* ========================================
   SCROLL SUAVE PARA NAVEGAÇÃO ÂNCORA
   ======================================== */

/**
 * Implementa scroll suave para todos os links âncora da página
 * Melhora a experiência de navegação entre seções
 */

// Seleciona todos os links que começam com "#" (links âncora)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Previne o comportamento padrão do link
        
        // Encontra o elemento de destino usando o href do link
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            // Calcula a posição considerando a altura do header fixo
            const headerOffset = 80; // Altura do header fixo em pixels
            const elementPosition = target.offsetTop; // Posição do elemento na página
            const offsetPosition = elementPosition - headerOffset; // Posição ajustada

            // Executa o scroll suave até a posição calculada
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth' // Animação suave do scroll
            });
        }
    });
});

/* ========================================
   DESTAQUE DO LINK ATIVO NA NAVEGAÇÃO
   ======================================== */

/**
 * Sistema de navegação ativa que destaca o link correspondente à seção visível
 * Monitora o scroll da página e atualiza o menu de navegação
 */

// Monitora o evento de scroll da janela
window.addEventListener('scroll', () => {
    // Seleciona todas as seções que possuem ID (seções navegáveis)
    const sections = document.querySelectorAll('section[id]');
    // Seleciona todos os links de navegação
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = ''; // Variável para armazenar a seção atual
    
    // Verifica qual seção está visível na tela
    sections.forEach(section => {
        const sectionTop = section.offsetTop; // Posição do topo da seção
        const sectionHeight = section.clientHeight; // Altura da seção
        
        // Se a posição do scroll está dentro da seção (com margem de 200px)
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id'); // Define como seção atual
        }
    });

    // Atualiza os links de navegação com base na seção atual
    navLinks.forEach(link => {
        link.classList.remove('active'); // Remove classe ativa de todos os links
        
        // Adiciona classe ativa ao link correspondente à seção atual
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

/* ========================================
   ANIMAÇÕES DE ENTRADA (INTERSECTION OBSERVER)
   ======================================== */

/**
 * Sistema de animações que ativa quando elementos entram na viewport
 * Utiliza Intersection Observer API para melhor performance
 */

// Configurações do observer para controlar quando as animações são ativadas
const observerOptions = {
    threshold: 0.1, // Ativa quando 10% do elemento está visível
    rootMargin: '0px 0px -50px 0px' // Margem inferior de 50px para ativação antecipada
};

// Cria o observer que monitora quando elementos entram na tela
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Se o elemento está intersectando (visível na tela)
        if (entry.isIntersecting) {
            // Adiciona a classe de animação fade-in
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Inicia a observação dos elementos quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona elementos que devem ter animação de entrada (excluindo a seção hero)
    const animateElements = document.querySelectorAll('.content-card, .funnel-stage, .differential-item, .proposal-card, .accordion-item');
    
    // Adiciona cada elemento à lista de observação
    animateElements.forEach(el => observer.observe(el));
});

/* ========================================
   EFEITO DINÂMICO NO HEADER DURANTE SCROLL
   ======================================== */

/**
 * Altera a aparência do header conforme o usuário faz scroll
 * Aumenta a opacidade do fundo para melhor legibilidade
 */

// Monitora o scroll para ajustar o header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    
    // Se o usuário rolou mais de 100px da página
    if (window.scrollY > 100) {
        // Aumenta a opacidade do fundo do header
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        // Mantém a opacidade padrão quando no topo
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

/* ========================================
   ANIMAÇÃO DE CONTADORES NUMÉRICOS
   ======================================== */

/**
 * Anima contadores numéricos de 0 até o valor alvo
 * Utilizado na seção hero para animar as estatísticas
 * @param {HTMLElement} element - Elemento que exibirá o contador
 * @param {number} target - Valor final do contador
 * @param {string} suffix - Sufixo a ser adicionado (ex: 'k', '%')
 * @param {string} prefix - Prefixo a ser adicionado (ex: 'R$ ')
 * @param {number} duration - Duração da animação em milissegundos (padrão: 2000ms)
 */
function animateCounter(element, target, suffix = '', prefix = '', duration = 2000) {
    let start = 0; // Valor inicial do contador
    const steps = 100; // Número de passos da animação
    const increment = target / steps; // Incremento por passo
    const stepDuration = duration / steps; // Duração de cada passo
    
    // Timer que executa a cada stepDuration
    const timer = setInterval(() => {
        start += increment; // Incrementa o valor
        
        if (start >= target) {
            // Se atingiu o valor alvo, para a animação
            element.textContent = prefix + target + suffix;
            clearInterval(timer);
        } else {
            // Atualiza o texto com o valor atual (arredondado)
            element.textContent = prefix + Math.floor(start) + suffix;
        }
    }, stepDuration);
}



// Função alternativa para iniciar animação imediatamente
function startHeroAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const text = stat.textContent.trim();
        
        // Anima diferentes tipos de estatísticas
        if (text === '17') {
            // Reseta para 0 e anima o número de anos de experiência
            stat.textContent = '0';
            animateCounter(stat, 17);
        } else if (text === 'R$ 800') {
            // Reseta para R$ 0 e anima o valor monetário
            stat.textContent = 'R$ 0';
            animateCounter(stat, 800, '', 'R$ ');
        } else if (text === '40k') {
            // Reseta para 0 e anima o alcance
            stat.textContent = '0';
            animateCounter(stat, 40, 'k');
        }
    });
}



/* ========================================
   ANIMAÇÃO DE PROJEÇÕES MENSAIS
   ======================================== */

/**
 * Anima números de projeção que podem ter intervalos (ex: "20k - 40k")
 * @param {HTMLElement} element - Elemento que exibirá o contador
 * @param {string} targetText - Texto final (ex: "20k - 40k", "9 - 56")
 * @param {number} duration - Duração da animação em milissegundos
 */
function animateProjectionNumber(element, targetText, duration = 2000) {
    // Verifica se é um intervalo (contém " - ")
    if (targetText.includes(' - ')) {
        const parts = targetText.split(' - ');
        const startNum = parseInt(parts[0]);
        const endNum = parseInt(parts[1]);
        const suffix = parts[1].replace(/\d/g, ''); // Extrai sufixo (k, etc.)
        
        let currentStart = 0;
        let currentEnd = 0;
        const steps = 100;
        const incrementStart = startNum / steps;
        const incrementEnd = endNum / steps;
        const stepDuration = duration / steps;
        
        const timer = setInterval(() => {
            currentStart += incrementStart;
            currentEnd += incrementEnd;
            
            if (currentStart >= startNum && currentEnd >= endNum) {
                element.textContent = targetText;
                clearInterval(timer);
            } else {
                const displayStart = Math.floor(currentStart);
                const displayEnd = Math.floor(currentEnd);
                element.textContent = `${displayStart}${suffix} - ${displayEnd}${suffix}`;
            }
        }, stepDuration);
    } else {
        // Se não é um intervalo, usa a animação normal
        const num = parseInt(targetText);
        const suffix = targetText.replace(/\d/g, '');
        element.textContent = '0' + suffix;
        animateCounter(element, num, suffix);
    }
}

// Observer específico para animar projeções mensais
const projectionsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Seleciona todos os números das projeções
            const projectionNumbers = document.querySelectorAll('.projection-number');
            
            projectionNumbers.forEach(projection => {
                const text = projection.textContent.trim();
                animateProjectionNumber(projection, text);
            });
            
            // Para de observar após animar (executa apenas uma vez)
            projectionsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 }); // Reduzindo threshold para 10%

// Função alternativa para iniciar animação das projeções
function startProjectionsAnimation() {
    const projectionNumbers = document.querySelectorAll('.projection-number');
    
    projectionNumbers.forEach(projection => {
        const text = projection.textContent.trim();
        
        // Reseta o valor antes de animar
        if (text.includes(' - ')) {
            const parts = text.split(' - ');
            const suffix = parts[1].replace(/\d/g, '');
            projection.textContent = `0${suffix} - 0${suffix}`;
        } else {
            const suffix = text.replace(/\d/g, '');
            projection.textContent = '0' + suffix;
        }
        
        // Inicia a animação após um pequeno delay
        setTimeout(() => {
            animateProjectionNumber(projection, text);
        }, 100);
    });
}

// Inicia a observação da seção de projeções quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const projectionsSection = document.querySelector('.projections');
    if (projectionsSection) {
        projectionsObserver.observe(projectionsSection);
        
        // Também inicia a animação após um delay como fallback
        setTimeout(() => {
            startProjectionsAnimation();
        }, 2000);
    }
});

/* ========================================
   EFEITOS HOVER DINÂMICOS NOS CARDS
   ======================================== */

/**
 * Adiciona efeitos hover dinâmicos aos cards para melhor interatividade
 * Cria uma experiência mais rica para o usuário
 */

// Executa quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os cards que devem ter efeito hover
    const cards = document.querySelectorAll('.content-item, .differential-item, .funnel-stage');
    
    cards.forEach(card => {
        // Efeito quando o mouse entra no card
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)'; // Move o card para cima
            card.style.transition = 'transform 0.3s ease'; // Transição suave
        });
        
        // Efeito quando o mouse sai do card
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)'; // Retorna à posição original
        });
    });
});

/* ========================================
   EFEITO PARALLAX SUTIL NO HERO
   ======================================== */

/**
 * Adiciona efeito parallax sutil na seção hero
 * Cria profundidade visual durante o scroll
 */

// Monitora o scroll para aplicar efeito parallax
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset; // Posição atual do scroll
    const hero = document.querySelector('.hero'); // Seção hero
    
    if (hero) {
        // Calcula o deslocamento parallax (movimento mais lento que o scroll)
        const rate = scrolled * -0.5; // Velocidade do parallax (50% do scroll)
        hero.style.transform = `translateY(${rate}px)`; // Aplica o deslocamento
    }
});

/* ========================================
   ANIMAÇÃO DE CARREGAMENTO DA PÁGINA
   ======================================== */

/**
 * Remove a animação de loading quando a página carrega completamente
 * Melhora a percepção de performance do site
 */

// Executa quando todos os recursos da página foram carregados
window.addEventListener('load', () => {
    document.body.classList.add('loaded'); // Adiciona classe que remove o loading
});

/* ========================================
   ESTILOS CSS DINÂMICOS VIA JAVASCRIPT
   ======================================== */

/**
 * Adiciona estilos CSS dinamicamente via JavaScript
 * Útil para estilos que dependem de interações JavaScript
 */

// Cria um elemento style e adiciona ao head
const style = document.createElement('style');
style.textContent = `
    /* Estilo para link ativo na navegação - Aplicado dinamicamente */
    .nav-link.active {
        color: #2563eb !important; /* Cor azul para link ativo */
    }
    
    /* Linha indicadora para link ativo */
    .nav-link.active::after {
        width: 100% !important; /* Linha completa sob o link ativo */
    }
    
    /* Animação de carregamento da página */
    body.loaded {
        opacity: 1; /* Página totalmente visível após carregamento */
    }
    
    /* Estado inicial da página (invisível) */
    body {
        opacity: 0; /* Página invisível inicialmente */
        transition: opacity 0.3s ease; /* Transição suave para visibilidade */
    }
`;

// Adiciona os estilos ao head do documento
document.head.appendChild(style);



/* ========================================
   GRÁFICO DE PROJEÇÃO DE RESULTADOS
   ======================================== */

/**
 * Renderiza um gráfico de linha usando Chart.js para projeção de resultados.
 * Exibe o crescimento esperado de alcance e leads ao longo do tempo.
 */

// Carrega a biblioteca Chart.js dinamicamente
function loadChartJs(callback) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = callback;
    document.head.appendChild(script);
}

// Dados para o gráfico de projeção
const projectionData = {
    labels: ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6'],
    datasets: [
        {
            label: 'Alcance Estimado (milhares)',
            data: [40, 50, 65, 80, 95, 110],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.2)',
            fill: true,
            tension: 0.4
        },
        {
            label: 'Leads Qualificados',
            data: [9, 15, 22, 30, 38, 45],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            fill: true,
            tension: 0.4
        }
    ]
};

// Configurações do gráfico
const projectionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                font: {
                    size: 14
                }
            }
        },
        title: {
            display: true,
            text: 'Projeção de Alcance e Leads (6 Meses)',
            font: {
                size: 18,
                weight: 'bold'
            },
            color: '#1e293b'
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Quantidade',
                font: {
                    size: 14
                },
                color: '#475569'
            }
        },
        x: {
            title: {
                display: true,
                text: 'Período',
                font: {
                    size: 14
                },
                color: '#475569'
            }
        }
    }
};

// Renderiza o gráfico quando o DOM estiver carregado e Chart.js estiver disponível
document.addEventListener('DOMContentLoaded', () => {
    const chartCanvas = document.getElementById('projectionChart');
    if (chartCanvas) {
        loadChartJs(() => {
            new Chart(chartCanvas, {
                type: 'line',
                data: projectionData,
                options: projectionOptions
            });
        });
    }
});


/* ========================================
   ANIMAÇÃO DE CONTADORES NUMÉRICOS
   ======================================== */

function animateCounter(element, target, prefix = '', suffix = '', duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            clearInterval(timer);
            element.textContent = prefix + target + suffix;
        } else {
            element.textContent = prefix + Math.floor(start) + suffix;
        }
    }, 16);
}

const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                const prefix = stat.dataset.prefix || '';
                const suffix = stat.dataset.suffix || '';
                animateCounter(stat, target, prefix, suffix);
            });
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
});

/* ========================================
MENU MOBILE RESPONSIVO
======================================== */
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
});
