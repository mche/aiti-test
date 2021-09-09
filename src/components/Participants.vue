<template>
  <!--Profile v-if="!Profile && regForm" @on-cancel="regForm = false" @on-register="regForm = false" /-->
  <h2>Список участников забега <sup class="chip z-depth-1">{{Count}}</sup>
    <a v-show="!Profile" class="btn right" @click="$router.push('/profile')"><i class="material-icons left">add</i><span>Регистрация</span></a>
  </h2>
  <h3>Показать колонки (это сверх ТЗ)</h3>
  <ul class="pagination">
    <li v-for="col in columns" :key="col.name">
            <label class="chip grey lighten-4 hoverable">
              <input type="checkbox" :value="col" v-model="checkedColumns" />
              <span>{{col.title}}</span>
            </label>
    </li>
  </ul>

  <table class="striped responsive-table z-depth-1">
    <thead>
      <tr>
          <th v-for="col in CheckedColumns" :key="col.name" class="hoverable" :class="[col.class, orderCol === col ? 'order '+orderSc : '']" @click="ChangeOrder(col)">
              <span>{{col.title}}</span>
              <i class="material-icons material-icons-outlined left">sort</i>
          </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, idx) in Ordered" :key="idx" :title="JSON.stringify(item)">
        <td v-for="col in CheckedColumns" :key="col.name" :class="col.class">
          {{ FormatCell(col, item) }}
        </td>
      </tr>
    </tbody>
  </table>

  <ul v-show="Count > perPage" class="pagination center">
    <li :class="page === 0 ? 'disabled' : 'hoverable'" class=""><a @click="page--" href="javascript:" :class="page === 0 ? 'btn disabled' : ''"><i class="material-icons">chevron_left</i></a></li>
    <li v-for="p in Pages" :key="p" class="hoverable" :class="{'active': p === page}"><a @click="page=p" href="javascript:">{{p+1}}</a></li>
    <li :class="page === (Pages.length-1) ? 'disabled' : 'hoverable'"><a @click="page++" href="javascript:" :class="page === (Pages.length-1) ? 'btn disabled' : ''"><i class="material-icons">chevron_right</i></a></li>
    <div class="input-field right">
        <select id="per-page" v-model="perPage">
          <option value="" disabled selected>Выберите</option>
          <option v-for="r in perPageRows" :key="r" :value="r" :disabled="r >= Count ? true : false">{{r}}</option>    
        </select>
        <label for="per-page" class="active">Строк на странице</label>
    </div>
  </ul>

</template>

<script>
import { mapState } from 'vuex';
///import Profile from "./Profile";

const columns = [
  {name:'id', title:'#', disabled: true},
  {name:'name', title:'ФИО'},
  {name:'phone', title:'Телефон', disabled: true},
  {name:'createDate', title:'Дата заявки', format:"FormatDate"},
  {name:'birth', title:'Дата рождения', format:"FormatDate",  disabled: true},
  {name:'email', title:'Email'},
  {name:'passwd', title:'Пароль', disabled: true},
  {name:'distance', title:'Дистанция, км', class:'center'},
  {name:'payment', title:'Сумма взноса, руб', class:'center'},
];

function FormatDate(d){
    if (!d) return '';
    if (typeof d === 'string') d = new Date(d);
    return `${
    (d.getMonth()+1).toString().padStart(2, '0')}-${
    d.getDate().toString().padStart(2, '0')}-${
    d.getFullYear().toString().padStart(4, '0')
    }`;
}

function data(){
  return {
    columns,
    checkedColumns: columns.filter(col=>!col.disabled),
    orderCol: columns[3],
    orderSc: 'desc',
    page: 0,
    perPage: 3,
    perPageRows: [1,3,5,10,15,20,30,50],
  };
}

const methods = {
  ChangeOrder(col){
    if (this.orderCol === col) this.orderSc = this.orderSc === 'desc' ? 'asc' : 'desc';
    else this.orderSc = 'desc';
    this.orderCol = col;
  },
  FormatDate,
  FormatCell(col, item){
    return col.format ? this[col.format](item[col.name]) : item[col.name];
  },
};

const computed = {
  CheckedColumns(){// нужно сохранить порядок колонок
    return this.columns.filter(col=>this.checkedColumns.indexOf(col) >= 0);
  },
  Ordered(){
    return this.$store.getters.OrderBy(this.orderCol.name, this.orderSc).slice(this.page*this.perPage, (this.page+1)*this.perPage);
  },
  Count(){
    return this.$store.state.participants.length;
  },
  Pages(){
    return new Array(Math.ceil(this.Count/this.perPage)).fill().map((el, index) => index);
  },
  ...mapState({
    Profile: 'profile',
  }),
};

///const components = {Profile};

export default {
  data,
  methods,
  computed,
  ///components, 
};
</script>

<style lang="scss" scoped>

@import "../main.scss";

thead {
  background: lighten($primary-color, 49%);
}

table.striped tr {
    border-bottom: 1px solid rgba(0,0,0,0.12);
}

th.hoverable {
  cursor: pointer;
}

th.order.asc {
  i {
    transform: rotate(180deg);
  }
}
th:not(.order) i {
  display: none;
}

.pagination {
  li {
    margin: 0 0.5rem;
    i {
      vertical-align: bottom;
    }
  }
  a.hoverable, li:first-child a, li:last-child a {
    padding: 0 !important;
  }
  a.btn.disabled {
    background-color: transparent !important;
    padding: 0  !important;
  }

  .input-field {
    display: inline-block;
    label {
      white-space: nowrap;
    }
  }
} 

</style>