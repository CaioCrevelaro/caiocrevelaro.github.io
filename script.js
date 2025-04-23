/**
 * Script.js - Caio Crevelaro Portfolio
 * Versão responsiva com otimizações para dispositivos móveis
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos principais
    const header = document.querySelector('.md-top-app-bar');
    const menuBtn = document.querySelector('.md-menu-button');
    const navList = document.querySelector('.md-nav-list');
    const backToTopBtn = document.querySelector('.back-to-top');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.md-nav-item a');
    
    // Função para inicializar todas as funcionalidades
    const init = () => {
        setupMobileMenu();
        setupScrollEffects();
        setupSmoothScrolling();
        handleBackToTop();
        setupFormValidation();
        addSectionAnimations();
        handleTouchDevice();
    };
    
    // Verificar se é um dispositivo com toque
    const handleTouchDevice = () => {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('touch-device');
        }
    };
    
    // Menu mobile aprimorado
    const setupMobileMenu = () => {
        if (menuBtn) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Impedir propagação para o documento
                navList.classList.toggle('active');
                menuBtn.setAttribute('aria-expanded', navList.classList.contains('active'));
            });
            
            // Fechar menu ao clicar em um link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navList.classList.remove('active');
                    menuBtn.setAttribute('aria-expanded', 'false');
                });
            });
            
            // Fechar menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (
                    navList.classList.contains('active') && 
                    !navList.contains(e.target) && 
                    !menuBtn.contains(e.target)
                ) {
                    navList.classList.remove('active');
                    menuBtn.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Fechar menu ao pressionar Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    menuBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    };
    
    // Efeito de scroll no header com otimização de performance
    const setupScrollEffects = () => {
        let lastScrollTop = 0;
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Header efeito ao rolar
                    if (scrollTop > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                    
                    // Botão voltar ao topo
                    toggleBackToTopButton(scrollTop);
                    
                    // Destacar menu ativo
                    highlightActiveNavItem(scrollTop);
                    
                    ticking = false;
                    lastScrollTop = scrollTop;
                });
                
                ticking = true;
            }
        });
    };
    
    // Botão de voltar ao topo
    const handleBackToTop = () => {
        backToTopBtn.addEventListener('click', () => {
            // Rolar para o topo com animação suave
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Também pode ser acionado pela tecla Home
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Home' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    };
    
    // Controlar visibilidade do botão de voltar ao topo
    const toggleBackToTopButton = (scrollY) => {
        if (scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };
    
    // Destacar item do menu correspondente à seção atual
    const highlightActiveNavItem = (scrollY) => {
        const scrollPosition = scrollY + window.innerHeight / 3;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navigationLink = document.querySelector(`.md-nav-item a[href="#${sectionId}"]`);
            
            if (navigationLink && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.md-nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                navigationLink.parentElement.classList.add('active');
            }
        });
    };
    
    // Rolagem suave para links internos sem foco visual
    const setupSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Fechar menu mobile se estiver aberto
                    if (navList.classList.contains('active')) {
                        navList.classList.remove('active');
                        menuBtn.setAttribute('aria-expanded', 'false');
                    }
                    
                    // Calcular offset ajustado para cabeçalho fixo
                    const headerHeight = header.offsetHeight;
                    const targetOffset = targetElement.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = targetOffset - headerHeight - 20; // 20px de espaço extra
                    
                    // Realizar rolagem suave
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Atualizar a URL com hash sem aplicar foco visual
                    window.history.pushState(null, null, targetId);
                    
                    // Não aplicar foco ao elemento
                    // Isso remove: targetElement.focus({ preventScroll: true });
                }
            });
        });
    };
    
    // Validação de formulário aprimorada
    const setupFormValidation = () => {
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            // Adicionar validação em tempo real para campos
            const formFields = contactForm.querySelectorAll('input, textarea');
            
            formFields.forEach(field => {
                // Validar ao sair do campo
                field.addEventListener('blur', function() {
                    validateField(this);
                });
                
                // Remover mensagens de erro quando o usuário começa a digitar
                field.addEventListener('input', function() {
                    this.classList.remove('error');
                    const errorMessage = this.parentElement.querySelector('.error-message');
                    if (errorMessage) errorMessage.remove();
                });
            });
            
            // Para formulários que usam FormSubmit, não precisamos de envio AJAX personalizado
            // O código abaixo serve apenas para validação cliente-side
            
            contactForm.addEventListener('submit', function(e) {
                // Não previna o envio padrão para o FormSubmit funcionar
                
                // Validar todos os campos antes do envio
                let isValid = true;
                formFields.forEach(field => {
                    if (!validateField(field)) {
                        isValid = false;
                    }
                });
                
                if (!isValid) {
                    e.preventDefault(); // Evita o envio somente se a validação falhar
                    return;
                }
                
                // O FormSubmit tratará o envio real do formulário
            });
        }
    };
    
    // Validar campo individual
    const validateField = (field) => {
        let isValid = true;
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        
        // Remover mensagens de erro anteriores
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        field.classList.remove('error');
        
        // Verificar se o campo está vazio
        if (field.required && field.value.trim() === '') {
            errorMessage.textContent = 'This field is required.';
            isValid = false;
        }
        // Verificar email
        else if (field.type === 'email' && field.value.trim() !== '' && !isValidEmail(field.value)) {
            errorMessage.textContent = 'Please enter a valid email address.';
            isValid = false;
        }
        
        // Exibir mensagem de erro se o campo for inválido
        if (!isValid) {
            field.classList.add('error');
            field.parentElement.appendChild(errorMessage);
        }
        
        return isValid;
    };
    
    // Validador de email
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    
    // Adicionar animações às seções conforme o scroll com otimização para mobilidade
    const addSectionAnimations = () => {
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.15
            };
            
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        sectionObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            // Observar todas as seções, exceto hero que já tem fade-in
            document.querySelectorAll('section:not(.hero)').forEach(section => {
                section.classList.add('section-hidden');
                sectionObserver.observe(section);
            });
        } else {
            // Fallback para navegadores que não suportam IntersectionObserver
            document.querySelectorAll('section:not(.hero)').forEach(section => {
                section.classList.add('fade-in');
            });
        }
    };
    
    // Animação de efeito ripple para botões com suporte a toque
    const addRippleEffect = (e, button) => {
        const rect = button.getBoundingClientRect();
        const x = e.type.includes('touch') ? 
            e.changedTouches[0].clientX - rect.left : 
            e.clientX - rect.left;
        const y = e.type.includes('touch') ? 
            e.changedTouches[0].clientY - rect.top : 
            e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    };
    
    // Event listeners para efeito ripple em mouse e toque
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.md-elevated-button, .md-outlined-button, .md-submit-button');
        if (button) {
            addRippleEffect(e, button);
        }
    });
    
    document.addEventListener('touchend', function(e) {
        const button = e.target.closest('.md-elevated-button, .md-outlined-button, .md-submit-button');
        if (button) {
            addRippleEffect(e, button);
        }
    });
    
    // Adicionar .section-hidden ao CSS
    const addDynamicStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .section-hidden {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.5s ease-out, transform 0.5s ease-out;
            }
            
            .fade-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.4);
                width: 100px;
                height: 100px;
                margin-top: -50px;
                margin-left: -50px;
                animation: ripple 0.6s linear;
                transform: scale(0);
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(2.5);
                    opacity: 0;
                }
            }
            
            /* Remover outline nas seções quando clicadas/focadas */
            section:focus {
                outline: none;
            }
            
            /* Maintain keyboard accessibility with focus-visible */
            section:focus-visible {
                outline: 3px solid var(--md-sys-color-primary);
                outline-offset: 2px;
            }
            
            /* Estilos para erros de formulário */
            .error-message {
                color: var(--md-sys-color-error);
                font-size: 0.85rem;
                margin-top: 0.5rem;
            }
            
            .success-message {
                color: #4CAF50;
                font-size: 0.9rem;
                margin-top: 1rem;
                padding: 0.75rem;
                background-color: rgba(76, 175, 80, 0.1);
                border-radius: var(--md-sys-shape-corner-small);
                text-align: center;
            }
            
            input.error, textarea.error {
                border-color: var(--md-sys-color-error);
            }
            
            /* Melhorias para toque em dispositivos móveis */
            @media (hover: none) {
                .touch-device .md-nav-item a {
                    padding: 0.75rem;
                }
                
                .touch-device .contact-link {
                    padding: 0.75rem 0;
                }
                
                .touch-device .form-control {
                    font-size: 16px; /* Prevenir zoom do iOS */
                }
            }
        `;
        document.head.appendChild(style);
    };
    
    // Inicializar todas as funções
    addDynamicStyles();
    init();
    
    // Verificar se a URL tem um hash (âncora) ao carregar a página
    if (window.location.hash) {
        setTimeout(() => {
            const targetId = window.location.hash;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetOffset = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = targetOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 500); // Pequeno atraso para garantir que os elementos foram renderizados
    }
});