import { describe, it, expect } from "vitest";
import { extractTypeScriptFromVue } from "../extractTypeScriptFromVue";

describe("extractScriptFromVue", () => {
  it.each([
    {
      source: `
      <template>
        <div class="hello">hello</div>
      </template>

      <script lang="ts">
        import Vue from 'vue'

        export Vue.extend({
          name: 'HelloWorld',
          data() {
            return {
              message: 'Hello World!'
            }
          }
        })
      </script>

      <style>
        .hello {
          color: red;
        }
      </style>
      `,
      expected: [
        5,
        `
        import Vue from 'vue'

        export Vue.extend({
          name: 'HelloWorld',
          data() {
            return {
              message: 'Hello World!'
            }
          }
        })
      `,
      ],
    },
    {
      source: `
      <template>
        <div class="hello">hello</div>
      </template>

      <script>
        import Vue from 'vue'

        export Vue.extend({
          name: 'HelloWorld',
          data() {
            return {
              message: 'Hello World!'
            }
          }
        })
      </script>

      <style>
        .hello {
          color: red;
        }
      </style>
      `,
      expected: [0, ""],
    },
  ])("extractScript", ({ source, expected }) => {
    const result = extractTypeScriptFromVue(source);

    expect(result).toEqual(expected);
  });
});
