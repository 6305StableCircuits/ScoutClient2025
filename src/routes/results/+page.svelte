<script lang="ts">
    let {data} = $props();
    //@ts-ignore
    let {scoutingStuff}:{scoutingStuff:Record<string, any[]>} = data;
    let x = JSON.stringify(scoutingStuff);
    //@ts-ignore
    $inspect(scoutingStuff.data);


    let columns = []
let values = []
for (const [col, val] of Object.entries(JSON.stringify(scoutingStuff))) {  
  if (Array.isArray(val)) {
    columns.push(col)
    values.push(val)
  }
}

console.log(columns)
console.log(values)

// From the list of values get the max len of a list 
let rows_len = Math.max(0, ...values.map(item => item.length))

// Normalize lists to have the same length as the biggest one in the nested lists
let rows = values.map(li => {
    if (li.length != rows_len) {
        let fill_arr = Array.from({length: rows_len - li.length}).map(el => "")
        li.push(...fill_arr)
    }
    return li
})

console.log(rows)

let rows_range = Array.from({length: rows_len}).map(el => "")
</script>

<main>
    <table class="w-full">
        <thead class="capitalize border-b-2">
            <tr>
                {#each columns as col}
                    <td>{col}</td>
                {/each}
            </tr>
        </thead>
        
        <tbody>
            {#each rows as row}
              <tr>
                {#each row as cell}
                  <td>{cell}</td>
                {/each}
              </tr>
            {/each}
          </tbody>          
        
        </table>
</main>