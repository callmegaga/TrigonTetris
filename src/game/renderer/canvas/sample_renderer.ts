import { GAME_BOARD_CELL_SIZE } from "@/game/config";
import type { Block } from "@/game/blocks/block";
import { Shape1 } from "@/game/blocks/shape-1";
import { Shape2 } from "@/game/blocks/shape-2";
import { Shape5 } from "@/game/blocks/shape-5";

export class SampleRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private blocks: Block[] = [];
  private animationFrameId: number | null = null;
  private currentBlockIndex = 0;
  private rotationAngle = 0;

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    container.appendChild(this.canvas);
    
    // 设置画布大小
    this.canvas.width = 300;
    this.canvas.height = 300;
    
    // 初始化示例方块
    this.blocks = [
      new Shape5(),
      new Shape1(),
      new Shape2()
    ];
    
    // 设置初始位置
    this.blocks.forEach(block => {
      block.setPosition([2, 2]);
    });
  }

  private drawBlock(block: Block) {
    const cells = block.getCells();
    const position = block.getPosition();
    
    cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 0) return;
        
        const cellX = position[0] + x;
        const cellY = position[1] + y;
        
        this.ctx.save();
        this.ctx.translate(
          this.canvas.width / 2,
          this.canvas.height / 2
        );
        this.ctx.rotate(this.rotationAngle * Math.PI / 180);
        this.ctx.translate(
          -this.canvas.width / 2,
          -this.canvas.height / 2
        );
        
        // 绘制单元格
        this.ctx.fillStyle = '#4ade80';
        this.ctx.fillRect(
          cellX * GAME_BOARD_CELL_SIZE,
          cellY * GAME_BOARD_CELL_SIZE,
          GAME_BOARD_CELL_SIZE,
          GAME_BOARD_CELL_SIZE
        );
        
        // 绘制边框
        this.ctx.strokeStyle = '#22c55e';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
          cellX * GAME_BOARD_CELL_SIZE,
          cellY * GAME_BOARD_CELL_SIZE,
          GAME_BOARD_CELL_SIZE,
          GAME_BOARD_CELL_SIZE
        );
        
        this.ctx.restore();
      });
    });
  }

  private animate = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制当前方块
    this.drawBlock(this.blocks[this.currentBlockIndex]);
    
    // 更新旋转角度
    this.rotationAngle = (this.rotationAngle + 1) % 360;
    
    // 每3秒切换一次方块
    if (this.rotationAngle === 0) {
      this.currentBlockIndex = (this.currentBlockIndex + 1) % this.blocks.length;
    }
    
    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  public start() {
    if (!this.animationFrameId) {
      this.animate();
    }
  }

  public stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public destroy() {
    this.stop();
    this.canvas.remove();
  }
} 