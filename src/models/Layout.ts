class Layout {
  public footerHeight = 60;
  public headerHeight = 0;
  public sideWidth = 0;
  public cellSize = 0;
  public containerSize = 0;

  public size: number;

  private timer = 0;

  constructor(size: number) {
    this.size = size;

    window.addEventListener('resize', () => this.onResize());
  }

  public refresh() {
    const doc = document.documentElement;
    this.containerSize = (doc.clientHeight / 16) * 9;
    this.sideWidth = (doc.clientWidth - this.containerSize) / 2;
    this.cellSize = (this.containerSize - this.size * 3) / this.size;
    this.headerHeight =
      doc.clientHeight - this.footerHeight - this.containerSize;
  }

  public setSize(size: number) {
    this.size = size;
    this.refresh();
  }

  private onResize() {
    if (this.timer > 0) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => this.refresh(), 200);
  }
}

const layout = new Layout(8);
export default layout;
