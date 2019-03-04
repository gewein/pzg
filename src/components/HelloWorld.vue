<template>
  <div>
    <div>{{stat}}</div>
    <div class="container" :style="{width: width}">
      <div :class="asClass(c)" v-for="(c,i) in cells" :style="asStyle(c)" @click="onClick(c)" :key="i" @mouseover="onMouseOver(c)">{{c.type}}</div>
    </div>
    <div>
      <div v-for="(c,i) in cells" :key="i">{{c.row + ',' + c.col}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

enum CellType {
  A,
  B,
  C,
  D,
  Eraced
}

const ROWS = 5;
const COLS = 5;

class Cell {
  index: number;
  row: number;
  col: number;
  type: CellType;
  group: number | undefined;
  dropRows: number = 0;

  asDummy() {
    this.type = CellType.Eraced;
    this.row = -1;
    this.col = -1;
  }

  constructor(i: number) {
    this.index = i;
    this.type = Math.floor(Math.random() * 4) as CellType;
    this.row = Math.floor(i / COLS);
    this.col = Math.floor(i % COLS);
  }
}

@Component
export default class HelloWorld extends Vue {
  private cells: Cell[] = [];
  private stat = '';
  private selectedGroup: number | undefined = undefined;
  private width = COLS * 32 + 'px';
  @Prop() private msg!: string;

  created() {
    for (let i = 0; i < ROWS * COLS; i++) {
      this.cells[i] = new Cell(i);
    }
    this.setGroup();
  }

  onMouseOver(c: Cell) {
    this.stat = c.index + '-' + c.row + ',' + c.col + '(' + c.group + ')';
    this.selectedGroup = c.group;
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async onClick(selected: Cell) {
    var removed = this.cells.filter(c => c.group === selected.group);

    removed.forEach(r => {
      this.cells.forEach(x => {
        if (x.col === r.col && x.row < r.row) {
          x.dropRows += 1;
        }
      });
      r.asDummy();
    });

    await this.delay(500);

    this.$forceUpdate();

    this.cells.forEach(x => {
      var ismoved = x.dropRows > 0;
      x.index += x.dropRows * COLS;
      x.row += x.dropRows;
      x.dropRows = 0;
      this.cells[x.index] = x;
      if (ismoved) {
        console.log(x.index + '-' + x.row + ',' + x.col);
      }
    });

    await this.delay(500);
    this.setGroup();

    this.$forceUpdate();
  }

  setGroup() {
    this.cells.forEach(c => (c.group = undefined));

    var group = 0;
    this.cells.forEach(c => {
      var t = this.topCell(c);
      var r = this.rightCell(c);
      var l = this.leftCell(c);
      var b = this.bottomCell(c);

      if (c.group) {
        // すでに付与済み

        if (l && l.type === c.type && l.group !== c.group) {
          var replaceGroup = l.group;
          this.cells
            .filter(_ => _.group === replaceGroup)
            .forEach(_ => (_.group = c.group));
        }
      } else if (l && l.type == c.type) {
        c.group = l.group;
      } else if (t && t.type === c.type) {
        c.group = t.group;
      } else {
        // 新しいグループにして右と下に先につけておく
        c.group = group++;
      }

      if (b && b.group === undefined && b.type === c.type) {
        b.group = c.group;
      }
    });
  }

  asStyle(c: Cell) {
    return {
      top: c.row * 32 + 'px',
      left: c.col * 32 + 'px'
    };
  }

  asClass(c: Cell) {
    return {
      cell: true,
      selectedGroup: c.group === this.selectedGroup,
      eraced: c.row < 0
    };
  }

  leftCell(c: Cell): Cell | undefined {
    return c.col > 0 ? this.cells[c.index - 1] : undefined;
  }
  rightCell(c: Cell): Cell | undefined {
    return c.col < COLS - 1 ? this.cells[c.index + 1] : undefined;
  }
  topCell(c: Cell): Cell | undefined {
    return c.row > 0 ? this.cells[c.index - COLS] : undefined;
  }
  bottomCell(c: Cell): Cell | undefined {
    return c.row < ROWS - 1 ? this.cells[c.index + COLS] : undefined;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.container {
  user-select: none;
}
.cell {
  width: 32px;
  height: 32px;
  cursor: pointer;
  position: absolute;
  transition: all 300ms 0s ease;
}
.cell:hover {
  background: #42b983;
}
.selectedGroup {
  background: #c3fff4;
}
.eraced {
  display: none;
}
</style>
