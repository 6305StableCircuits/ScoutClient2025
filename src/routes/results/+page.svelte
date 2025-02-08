<script lang="ts">
  let {data} = $props();
  //@ts-ignore
  let {someData}:{scoutingStuff:Record<string, any[]>} = data;

  import { TableHandler } from '@vincjo/datatables'
  // import { someData } from './data'

  const table = new TableHandler(someData, { rowsPerPage: 50 })
</script>

<table>
  <thead>
      <tr>
          <th>First name</th>
          <th>Last name</th>
      </tr>
  </thead>
  <tbody>
      {#each table.rows as row}
          <tr>
              <td>{row.first_name}</td>
              <td>{row.last_name}</td>
          </tr>
      {/each}
  </tbody>
</table>