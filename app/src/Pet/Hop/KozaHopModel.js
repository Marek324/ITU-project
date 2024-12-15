class KozaHopModel {
    constructor() {
        this.platforms = [];
        this.platformCount = 5;
        this.koza = {
            left: 0,
            bottom: 150,
            isJumping: true,
            startPoint: 150
        };
        this.score = 0;
        this.gameOver = false;
        this.isMovingLeft = false;
        this.isMovingRight = false;

        // Difficulty presets
        this.difficulties = {
            easy: {
                GRAVITY: 4,
                JUMP_FORCE: 15,
                PLATFORM_SPEED: 4,
                MOVE_SPEED: 3,
                MOVING_PLATFORM_CHANCE: 0.2,
                PLATFORM_MOVE_SPEED: 1.5
            },
            medium: {
                GRAVITY: 5,
                JUMP_FORCE: 17,
                PLATFORM_SPEED: 5,
                MOVE_SPEED: 4,
                MOVING_PLATFORM_CHANCE: 0.5,
                PLATFORM_MOVE_SPEED: 2
            },
            hard: {
                GRAVITY: 6,
                JUMP_FORCE: 19,
                PLATFORM_SPEED: 6,
                MOVE_SPEED: 5,
                MOVING_PLATFORM_CHANCE: 1,
                PLATFORM_MOVE_SPEED: 2.5,
                INITIAL_SPIKE_CHANCE: 0.2,
                SPIKE_CHANCE_INCREMENT: 0.01
            }
        };

        // Constants
        this.GAME_WIDTH = 375;
        this.GAME_HEIGHT = 667;
        this.SCROLL_THRESHOLD = 300;
        this.MAX_JUMP_HEIGHT = 200;
        
        // Set default difficulty
        this.setDifficulty('medium');
        
        this.initGame();
    }

    generatePlatform(bottom) {
        const isMoving = Math.random() < this.MOVING_PLATFORM_CHANCE;
        const hasSpikes = this.currentDifficulty === 'hard' && 
                         Math.random() < this.spikeChance;
        
        return {
            left: Math.random() * (this.GAME_WIDTH - 85),
            bottom: bottom,
            width: 85,
            height: 15,
            isMoving: isMoving,
            movingRight: Math.random() < 0.5,
            originalX: 0,
            hasSpikes: hasSpikes,
            spikePosition: Math.random() < 0.5 ? 'left' : 'right'
        };
    }

    initGame() {
        // Create initial platforms
        this.platforms = [];
        for (let i = 0; i < this.platformCount; i++) {
            const platGap = 600 / this.platformCount;
            const newPlatBottom = 100 + i * platGap;
            const platform = this.generatePlatform(newPlatBottom);
            platform.originalX = platform.left;  // Store initial position
            this.platforms.push(platform);
        }

        // Initialize koza above first platform
        this.koza = {
            left: this.platforms[0].left,
            bottom: 150,
            isJumping: true,
            startPoint: 150
        };
        
        this.score = 0;
        this.gameOver = false;
    }

    updateMovingPlatforms() {
        this.platforms.forEach(platform => {
            if (platform.isMoving) {
                if (platform.movingRight) {
                    platform.left += this.PLATFORM_MOVE_SPEED;
                    if (platform.left > this.GAME_WIDTH - 85) {
                        platform.movingRight = false;
                    }
                } else {
                    platform.left -= this.PLATFORM_MOVE_SPEED;
                    if (platform.left < 0) {
                        platform.movingRight = true;
                    }
                }
            }
        });
    }

    update() {
        if (this.gameOver) return;

        // Update moving platforms
        this.updateMovingPlatforms();

        // Update koza position
        if (this.isMovingLeft && this.koza.left >= 0) {
            this.koza.left -= this.MOVE_SPEED;
        }
        if (this.isMovingRight && this.koza.left <= this.GAME_WIDTH - 60) {
            this.koza.left += this.MOVE_SPEED;
        }

        // Handle jumping and falling
        if (this.koza.isJumping) {
            this.koza.bottom += this.JUMP_FORCE;
            
            // Start scrolling earlier for smoother transition
            if (this.koza.bottom > this.SCROLL_THRESHOLD) {
                const scrollAmount = (this.koza.bottom - this.SCROLL_THRESHOLD) * 0.1;
                const actualScroll = Math.min(this.PLATFORM_SPEED, scrollAmount);
                
                // Move platforms down smoothly
                this.platforms = this.platforms.map(platform => ({
                    ...platform,
                    bottom: platform.bottom - actualScroll
                }));
                
                // Adjust koza position to match scrolling
                this.koza.bottom -= actualScroll;
                this.koza.startPoint -= actualScroll;
            }

            // Check if we should stop jumping
            if (this.koza.bottom > this.koza.startPoint + this.MAX_JUMP_HEIGHT) {
                this.koza.isJumping = false;
            }
        } else {
            this.koza.bottom -= this.GRAVITY;
        }

        // Move platforms down when koza is high enough
        if (this.koza.bottom > this.SCROLL_THRESHOLD) {
            const scrollAmount = this.PLATFORM_SPEED;
            this.platforms = this.platforms.map(platform => ({
                ...platform,
                bottom: platform.bottom - scrollAmount
            }));
            
            // Adjust koza position to match scrolling
            this.koza.bottom -= scrollAmount;
            this.koza.startPoint -= scrollAmount;
        }

        // Remove low platforms and add new ones at the top
        if (this.platforms[0].bottom < 10) {
            this.platforms.shift();
            this.score++;
            const newPlatform = this.generatePlatform(600);
            newPlatform.originalX = newPlatform.left;
            this.platforms.push(newPlatform);
        }

        // Check platform collisions
        this.platforms.forEach(platform => {
            if (
                this.koza.bottom >= platform.bottom &&
                this.koza.bottom <= platform.bottom + 15 &&
                this.koza.left + 60 >= platform.left &&
                this.koza.left <= platform.left + 85 &&
                !this.koza.isJumping
            ) {
                // Check if koza hits spikes
                if (platform.hasSpikes) {
                    const kozaCenter = this.koza.left + 30;
                    const platformCenter = platform.left + 42.5;
                    const isOnSpikedHalf = platform.spikePosition === 'left' 
                        ? (kozaCenter < platformCenter) 
                        : (kozaCenter > platformCenter);
                    
                    if (isOnSpikedHalf) {
                        this.gameOver = true;
                        return;
                    }
                }
                
                this.koza.isJumping = true;
                this.koza.startPoint = this.koza.bottom;
            }
        });

        // Check game over
        if (this.koza.bottom <= 0) {
            this.gameOver = true;
        }

        if (this.currentDifficulty === 'hard') {
            this.spikeChance = Math.min(
                0.8,
                this.difficulties.hard.INITIAL_SPIKE_CHANCE + 
                (this.score * this.difficulties.hard.SPIKE_CHANCE_INCREMENT)
            );
        }
    }

    setDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        const settings = this.difficulties[difficulty];
        this.GRAVITY = settings.GRAVITY;
        this.JUMP_FORCE = settings.JUMP_FORCE;
        this.PLATFORM_SPEED = settings.PLATFORM_SPEED;
        this.MOVE_SPEED = settings.MOVE_SPEED;
        this.MOVING_PLATFORM_CHANCE = settings.MOVING_PLATFORM_CHANCE;
        this.PLATFORM_MOVE_SPEED = settings.PLATFORM_MOVE_SPEED;
        if (difficulty === 'hard') {
            this.spikeChance = settings.INITIAL_SPIKE_CHANCE;
        } else {
            this.spikeChance = 0;
        }
    }

    setMovement(direction, value) {
        if (direction === 'left') {
            this.isMovingLeft = value;
        } else if (direction === 'right') {
            this.isMovingRight = value;
        }
    }
}

export default KozaHopModel;