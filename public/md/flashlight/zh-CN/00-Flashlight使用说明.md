<h1 id="flashlight-使用说明" data-toc-id="flashlight-使用说明">Flashlight 使用说明</h1>
<p>Flashlight 给 Minecraft 带来真正的动态照明：基于 Photon
  的聚光灯、空气光束与阴影，不在世界里放置任何隐形光源方块。一支手电筒可以拿在手里、染成任意颜色、放到墙上当固定灯，或装上枪、戴在肩上；再配上不耗电、可摇头、可红石控制的舞台灯，从下矿洞到布置演出场景都够用。
</p>
<h2 id="前置与安装" data-toc-id="前置与安装">前置与安装</h2>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr>
      <th>模组</th>
      <th>安装位置</th>
      <th>说明</th>
    </tr>
    <tr>
      <td>LDLib2 ≥ 2.2.40</td>
      <td>客户端和服务端</td>
      <td>数据保存与配置界面</td>
    </tr>
    <tr>
      <td>Photon ≥ 2.2.8、KilaGraph ≥ 21.1.0.16</td>
      <td>客户端</td>
      <td>渲染聚光灯、光束和阴影</td>
    </tr>
    <tr>
      <td>TaCZ 社区移植版、Curios</td>
      <td>可选，按需两端安装</td>
      <td>枪灯、肩灯联动</td>
    </tr>
    <tr>
      <td>Create Aeronautics + Sable + Create</td>
      <td>可选，按需两端安装</td>
      <td>移动结构上的灯具</td>
    </tr>
  </tbody>
</table>
<p>多人游戏服务器只需要 Flashlight 和 LDLib2；其余为客户端或可选内容。启动后在 Photon
  配置中开启动态光照，实际阴影和光束效果还受每位玩家的 Photon 画质与光影包影响。</p>
<h2 id="物品与合成" data-toc-id="物品与合成">物品与合成</h2>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr>
      <th>物品</th>
      <th>标识</th>
      <th>获取与用途</th>
    </tr>
    <tr>
      <td>手电筒</td>
      <td>flashlight:flashlight</td>
      <td>手持照明、染色、放置为支架，或用于联动；暂无生存合成，可由指令或整合包发放</td>
    </tr>
    <tr>
      <td>电池</td>
      <td>flashlight:battery</td>
      <td>铁锭、铜锭、红石粉各一，无序合成</td>
    </tr>
    <tr>
      <td>手电筒支架</td>
      <td>flashlight:mounted_flashlight</td>
      <td>直接放置的固定灯，内部自带一支关闭的手电筒</td>
    </tr>
    <tr>
      <td>舞台摇头灯</td>
      <td>flashlight:stage_light</td>
      <td>可调色、方向、摇头和红石控制的固定灯</td>
    </tr>
  </tbody>
</table>
<p>舞台摇头灯配方：</p><img
  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA1gAAAGcCAIAAABLG5Z0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAgAElEQVR4nO3dX4xk1X0n8HN7YMDgZAwD86cHy5sX8K7kIQbGxOHBiZwXZG1Wyk7gIZHymmw20np3HMl2jJ3YxpEs8eL8lZBQpOQFsCU7WH6JlVjITByIHYYoBGKCLXv+MOMBDzD/eqb77sOpun3q3ls9t6f+dp3PR1an+tStW7crhf3ld8753eKZZ5554YUXQsOHPvSh5iAAAFvOt771rebg+973vqXpXwoAAPPgmhdeeKG1+Pf6669P/2oAABi75eXl5uALL7ygIggAkClBEAAgU4IgAECmBEEAgEwJggAAmRIEAQAyJQgCAGRKEAQAyJQgCACQKUEQACBTgiAAQKYEQQCATAmCAACZumb0U3z0ox8d/SRs7ODBg83BJ598cvpXkhuf/Ky0fvL33Xff9K8EYIGpCAIAZEoQBADIlCAIAJApQRAAIFOCIABApgRBAIBMjaF9TKvW1g9ctUOHDjUHW5uY+OTHyyc/K62f/OHDh6d/JQALTEWQGdj34Y/s+/BHZn0VAJC7SVUEoVWa/+Ljo9/8+uwuBwCyJggyJcNKgOIgAMyKIMjErd3zS7WRGPvSaPjh3/yNEMI3//pvpnhdAJA7QZAJSiPgj86cDSEsPfcP1UiMgzECRuIgAEyTIMhEpNW+ZgRMxdgXI+C/H/9pMFkMANMiCDJma/f80rt33JiODIuAqRgHa1tJ3rv3XaqDADA5giBjU00ExxLgu3fcuNmqXrV28L173xVHTBYDwOQIgoxBczvI0nP/cPRqz3b0m18/au0gAEyeIMhIWiPgWM6crh2MxEEAGC9BkKs0uQiYEgcBYHIEQTZtOhEwJQ4CwCQIgmzC9CNgShwEgPESBLs6cuRIxyP3798/0SuZidlGwJQ4ODWZf+cBciAIcgXzEwFT4iAAjE4QZKj5jIApcRAARiEI0mL+I2BKHASAqyMIMmBrRcCUOAgAmyUI0rN1I2BKHASA7gRBFiQCpsRBAOgioyDYvRdGq/vvv7/jkc8++2xzcHl5eZR3n5BFioD7PvyREMLRb369GhEHfecB2FhGQZDU4kXA9LE4CABdCILZqWLTj86cjQ+aETCNTfMfmGLsa0bAlDgIAE2CYEbSylkI4d07bhwWm7ai9+59Vwjh6IbHiIMAkBIEs1CLgGF45SzaWsFos8FOHASAaGnWF8A0vPqPf18baUbD1Id/8zeq/0zyusYjDXDf/Ou/6ZLnmn/Xod/9P2O+LACYeyqCuYhZ8Od+4ZerkX0f/siPzpzdeIFg/HX+S2Xf/Ou/6XidIiAAVLZSEJxEL4w777xzlHN2Nyf9Nao4WO0UiduH0ziYzpzOfwQMSbbb+JqbEfBzH/v9iV7Y6HznAZiorRQEGZcYB6/5rx+oRobFwS0hlgM3OGArRkAAmAJBMF+XX/yncKU4uFUsUhUQAKZGEMzL9rPnVm68IR1ZpDiY6hgBP3jnnd843DKDCQA5EASzs/3suRDCAsfB7hFwKpcDAPNLEMzUQsZBERAANkUQzNrCxMERI+Abb705/msCgLk31SC4pXthdNf9kuakv8aWjoOjVwEnmgJ952vm5DsPQKQiSM+Wi4MmggFgRIIgA7ZEHBQBAWAsBEFadI+DZ06fvOnVf5vahYmAADBGgiBDbRwHz5w+GUfe+Ln/FkKYdBwUAQFg7ARBemLgi+EvNSwO3hjC2V3/Jf66Y+eutZ27wmQmi0VAAJgQQZABKzfe0MyCYUgcvPHkD8IkJ4tFQACYqEkFwdauGY899lhz8KWXXprQNczKHXfc0XGwtenGo48+Ov5rGm5Y8ms1tcnirRgBfee7DM7Ddx6Aioog9WB3RV0mi8PVxsGtGAEBYIsSBDP1w5Xwnu0DI63xbgMbTBZfXRwUAQFgygTBfP1wJYQQ9t44MNh9mjg9fsQ4OA8RcPt175jcyQFgPgmCudtsIbD7SZpxcN+HPxJCOPrNr1cjIiAAzJAgSAibLwRucJLWOPhzv/DL1UiMg+/d+67ay00EA8CUCYKZes/23tTw2LXGwVf/8e/DYBz89+M/Df04KAICwExMNQg+/vjjzcEHHnigOTjb/hqtbS+6a7341gYZBw4caA4+/fTTo7x7d7XNIuM1LA4ef+PcL97/kWpkTiLgysXzEzqz73zNbL/zANSoCDJBrXHwmW98PYRw7MXnm8fPpAo4uRQIAHNOEGTiuuxHGRYBDz///AbPAgCjEASZkmH7UTYIeTEFAgATIgiCDjIAZGpp1hcAMyYFApAtFUHmmtWBADA5sw+Ck+ivMYleGE888URz8MyZMx3PuWPHjlEuKUOHn39+UVOg7zwAc2L2QZCs/OjUyRDCu2/dtcEx9ogAwHRYI8gMxDgIAMyWIAgAkClTw8yjRV0dCABzRUWQ+fKNw89KgQAwHSqCzItvHH521pcAAHmZ0yDYvb9Gq0n0wujuwIEDYz8nC893HoDpMzUMAJApQZD5cv8H1ZYAYErmdGqYDImAADBlKoIAAJkSBJmqG975s7O+BACgRxBk2m5458+KgwAwD6a6RvDll19uDt5+++0dX75VGmS0/plPPfVUx5c/+OCDXa+Juec734XvPMCsqAgCAGRKEMzC8TfOHX/j3KyvIoQQzr395rm335z1VQAAIQiCWZmTLBhCkAUBYB4IggAAmRIEs7D3phtmfQlz5PDzzx9+/vlZXwUAzJ47i+SilwXPznh2ODaOmeHUsAgIAJVJBcH9+/c3B48cOdLx5d37a4xox44dHY985JFHRnkjDTJSN7zzZy/+5Pisr2LMfOdrfOcB5p+pYXL0wTvvnPUlAMDsmRrOwvE3zlkmGA2LgDduv3bKVwIAMycI5iL2jnnP9llfx+zE1YHNICgCApAtU8NkwR4RAGgSBAEAMiUIAgBkaqprBEfsr9HdsWPHmoOvvPLKKOfUC2Orm8lOYd95AOaZzSJ5+eFKCFluGWlNgd84/Oz0rwQA5ocgmKMfroTT5y/cteP6WV/IzDz5rWdsFgYAQTALsQQYy4GV7565EELILQ4++a1nmoP3f/DA9K8EAGZOEMxIaxzMZ7JYBASAGkEwOzHznT4/MLjYk8UiIAC0EgQzFTNfnB2uLN5kcWsEPPihX5z+lQDAHJp9EOzeX6O1F8aLL77Y8Y30wmiKmW8h1w7OcwT0nQc6+uhHPzrrS2BeHDx4sDl43333jXja2QdBZq51sngscXDlxhtCCNvPnhvlJJs1zxEQAOaKIEjP5CaLV268YTpZUAQEgE0RBBkwljg4/UKgCAgAV0EQpMW44uD2s+diKGz103Mrw57qTgQEgKsmCDLUWOLgsLrg6ClQBASAEQmCXMEcNpoRAQFgLOY0CLb21xjxSEaxqTgYq4AbTApX3nXD5m5pssAR0Hce6Ki1jQgL79ChQ83Bw4cPj3jaOQ2CzKeriIPDiIAAMHOCIJs25cliERAAJkQQ5CpNIQ6KgAAwUYIgI9lsHNz5jutPn18/eNje4W8cfrY5KAICwHgJgozBpuLgzndcH0L4tyER8MlvPXPj9mtrgyIgAEyCIMjYjDhZbCIYAKZMEGTMWuPgD1dCCOE9QzYKt04E3//BA2O/NgAgJQgyERvEwZpmChQBAWA6BEEmqDUObsBEMABMkyDIxMU42FoOrKgCAsD0CYJMSVwg2IyDIiAAzIogyFSlcVAEBIDZEgSZgfdsD++RAgFg1sYQBA8ePNgcPHTo0OhnZmM++VnxyQOwGJZmfQEAAMyGIAgAkClBEAAgU4IgAECmBEEAgEwJggAAmRpD+5gnn3yy4yBXrbVfiU9+Cnzys9L6yd93333TvxKABaYiCACQKUEQACBTgiAAQKYEQQCATAmCAACZEgQBADI1hvYxrVpbP3DVDh061Bxs7Vfikx8vn/ystH7yhw8fnv6VACwwFUEAgEwJggAAmRIEAQAyJQgCAGRKEAQAyJQgCACQqUm1jwGA6Nvf/nZz8L777pv+lbB1PfGVr4UQyrIMITzwP//HrC9ncQiCAMD8evzLXy2KIvRTYOiHwjgiFI5IEAQA5lEMfFUKjA9SRVE8/uWvxge//mu/Ov0rXACCIAAwj04cPxof7N6zXBRFURRVUTD0o2GVDqtEGEIQCrsTBAGAufbaiWMhhFCWe5Zvi/kvLRBWibAsy5gUlQm7EwQBgK3hxLEfh37+i2XC9NkqIFYxMSbCYH/JcIIgADC/Tp48vbS0dMstN9XGe2XCEPbs3VdNGadlwvRgm46HEQS7OnLkSMcj9+/fP9ErgenwnWei9JThik6ePB0frK2txcdlWe7etTMMFgKrpYQhhD1794XG/pI4ZRwf219SIwgCAHPnoc98vtY1Jj547eTpbdu2hRDW1tZ27dpZe9WJYz+OD/Ys31ZVB1u3G5dlaX9JEAQBgLnyBw99Nj6oJbn0Z3xw6tTrIYS1tbXdu2+pnaRKhLuTGmFoa0NThcI8E6EgCADMhU//4cMhhKrgV43HWmBVIKyeWlpaij9fe+0n1citg6sJX4sTx0URQti7fFtt7WC61zj+fOIrX8tqKaEgCADMXiwExhQYQlhaWqoCX+vcbhgMiNVrf3L6p6urq81EGEI4Xk0c791XO1vtVEtLS3F/ycIXCAVBAGCWqrngpaWlWiCLqopdLAFWYbEq78XxtFi4trZ28tTr8fGuW2+uvWO1v6TacVybO15bW/vhq6+M70+cX4IgADAbn/r052IOq7JdqjaNG5L54pj80mNikqvGQ3+zcAjhtf7u46WlpVsHQ+GJ40dD/wx7lm+Lx7z6yn+UoSxCvQy5kDIKgt17YbS6//77Ox757LPPNgeXl5dHefct7V/+4GMdj/z5z31xoleSG995thw9ZbLyqU9/LoTQvHdcGFwgGNUqdrXjq/wXJ4Wr01aD1ZFxf0lZli07jo8fDSFcOH9+pL9qq8koCAIA8yCdC649lU4K18p76Uht+WB8Ng6ura3V5o6rGef0XeL+knjC5mrCEEImRUFBEACYkoc+8/nQyH9p/S9muCrJra2tpVFvdXV127ZttQniagq4tQrY3GiSii88eer1y5cuLC8vhw0PXkiCIAAwEbWOzcMKgekG4eakcJwLjsfEbRwhiXfV8bUWM9UEcTygtt0kPcPllfPx9/5Z1guBZagvUlw8giAAMGZVBIzluiPPH3n+X54PjZu/hcEAl94RLj6bRsbmPHK6+C+qcmHahiZ9Km0ZWBRFLwVmTBAEAMbpia98rdrP8a8v/GscTKdom4/T/R/V9pENZnWbhcNmqS8kiTNdUxgfX750oTquDKEoy2peOIdCYEUQBADGI0bA+LgoiheOvFA9VVvGl+7eqKZxq5GqeldbBZhKC4RVjkwDYjwgrRpWdyJZuXhu/cKG/C1FKHJIhFspCE6iF8add945yjm7y6S/RmunmF0XW468d0fLv+f9bdvLc+4p4zsPQU+ZreNLf/rn8cHuPctVIbB5d5DW7oC1umBVtwuDc8fVkelukioshsHKYnyqtgBx9dKF1nBXG8xhv3C0lYIgADDnTp16/VT/lh6hvxGkOcnbugowzXDDRpq/xvNXs8nNu5LEkdpywGLwQbn+axaFwIogCACMzaWVCyGEYqkIIVxzzXVVDqsepD8rzT5/rbtJmmqFwDiJnM41x58rF872jh9y2c2zZxIHBUEAYEwG89zly721QUtL14bBm4LUKoLNBYLpWsPQaAQTkqYz6RmqntJVE+m4HLBW9ouPa+GvqgXmMy8cBEEAYIxiLbBm9fJKfHDNtddVwa65ayQM6SPYrPBFMe2l+TItJV5KdoQMU4uDMQsKggAAXT30mc/HhXq7br05jrz/rnvig+9997n0yMuXejXCoiiu3X59+lTtfiFRtRe4ebO4ao9I61zzysVz8fdhma5ICoTNOeAYB3OYHRYEAYCrV6XAEMJrJ0+//657qqxWlmVMhGVZfu+fn6u98NLKhXhkTIQx2K2trcWJ3Vq8i11gNmgfWL1prTVM2iywUhRFNYu9HgfL+slzMNUguKV7YXTX/ZK2dH+N1k4x//36ln/1Onix5d+onmw759G2fwaf/1jLG/3WF7dGTxnf+Zot/Z1nrugpMyc+/olPFUtFXAJYFMWuXTtPHD+6e89ysyP0++++Jx7z3efq/z1QlQmXtvXOU/ZVbWKamqHw0uC+4PX/7Um7VYf+3eSuJIdyYFARBACuWlwRGJcAVrHvtRPHQgihLPcs3xaS2duYxmIijMd/75+fS9cIrq1eqg7bds32EMLq6mrVBXr9TQd7CkZVITBtJRh/7/3fwStf7xfTtlQxH4IgAHC1yhBiHCxbstSJYz+uctievfvig6pYWJbl++/uzSP/y3f/ufbaKlwuLV3XbC7Te/OyDCFcvnSh+VRN62jrwelOkRx2jQiCAMBV6u3VDYMTwTG3JevwQggnjh+ND6pEmPr5u+6OD5pLCauJ41CEbdt6ZcI4sHq57dZVtWYxyTWUIdx94N4Qwnef+6daG8O2kyx+CgyCIAAwimKpKNf6QaqWqKosmNTeThw/GgfjxHGtvHfXPQeqRjDNULi6uhLz3dK2ay9futBS0ksuYOC5oggh3H3PB+Jv77/7QDUj/L3n/mlTf++CEQQBgBEkd2frcHBZhcITx35cDe9Zvi3tBRhCKMvyrnsOxIWA333u2Vrmq6aD00pkbS9wul+4ioA1RVG8/54PxDOk15MPQRAAGEncMlKu9UNec6Y1yX/rzya5LZ04rm4ZXG0Hef/d91QrC6tQmG4KSeNg7b3vOnBv41rK9CXV3ZD3LN/2g//8/vpheXSWnlQQbO2a8dhjjzUHX3rppQldw6zccccdHQdbm248+uij47+m0WyiU8yZtk4xO1qO/E7bkX/X9u6/cm3L4F/NX08Z3/kug1vlO88WpafM9PWqd2uDtwPu1p+ld+RgaqwSYRgMhSGEH7z6/ZjMao1p1reSJJtKYnVw+bbbaoc1u0/H8VoE7Hr9W5+KIABwldaDWhHWVwqmhtUIGydqxsfeXG1R7Nm7Lw1qQ8+w/p7JksT+zuW4SSXtZVM9qCLmwIW7swgAwAbW52fLJH41NoisDzZHOiTFtEzYf2n7ppD0ce2MVawMIezZuy/m11df+Y+B04by7bcvVH/XO995fVh0giAAMKp6G+dK62Br+GuNj6G9WLixK3aHjsnywvn1O5FUKwLjDUuKori8cj4IggAAwzz8+T8KIXz8E58qyzJuGWnXWAvYGwxD4mDN+l7ggULg+m2C2+4p3KtQxrfeMEqms8C9CNg7p80iAAAb+sLDnw0hfOlP/uzKawGH2SAphljiKwfiWnJU2XgQbbvmuvZ3SXeKhF5D7BDCW2+fX7l4rmicZ7EJggDAWG1QfksDX/dZ47YTlsN/3X7dDbEjzMmTp+PIrl07G68vq1j51tvny7JMCoEDJcbFNtUg+PjjjzcHH3jggebgbPtrtLa96K714lsbZBw4cKA5+PTTT4/y7iPq3immVWunmNaeMqHtyF8513LkvqXmWAhbpKeM73zNHH7nR9Tar4S5oqfM9HTMcK3Fvw1mhNcbBA7cLG6Y7dfdEAbbxJRleerU6/HZW2+5qXb8229fqAqBcaVjeaW3WCQqggDA+AwrB1YxsXbAYHzsdQrsFsOqnJcOXlq5EO96d+3266uNzGtra0tLS2VZvnbydFEUS0tL8YUrF8+FwRJgkZy9yzVsdYIgADBFG8wIt4lLA6sFgv1slwa29TgYR2NHw0srF6r7kWy7ZnvcDhwjYJw4Xrl4rrorXW/X83oe7dD7cCEIggDAtDTnhWu7N8q1lhdtsGCvbUfw+u3myjJWBy9futifLN5eluXq5YuhH/56P6sI2J8dzqIeKAgCAGPTjGXN7oCtWXCjU64VxVLolwYHbg3SdoaY/OLNTopQxE7X1f2FVy+vlOVaVT4sar2pYyiMp9zUH75lCYIAwPi0Nu2rBlvXCF5pErZWJizLcj29JS+vCoExC6ZRrkqH6Wub71r2Y+sVW1IvjNYNmQAAm9QxPLX2C2xdIzg43rKDpKivFIzHhV6cK9Z7XJehWCrSdYS9VyU/ey9JbkOcg9lXBCfRX2MSvTCeeOKJ5uCZM2c6nnPHjh2jXNIktHaK2XWx5ciDF1v+2W7tFPOdtk4xf9HW6uXv2o78TsuB4XttL//tG1re/YvnW77PmfSU8Z2HTdFTZtqG5bwNBtti5RVv9VGWZVGEaiK4Oj5mu94ccVEUtcpfUYSyXI+AZXnzzTeHzpuXtzQVQQBgTFq7BtYWCLbmvzhlXDuydqZmCkz2+VZzvlU9r/azXCurrSEhWWWY9g6Mj3fubHSfXlyzrwgCAIujWrR3dbOrV3ptnO0tV5NXpM+GwV/69wlZj4DJu/Sej7XAEMoQbr75phzuL5wSBAGAWRtWJqwehrJ7ROsFvvhjrb4pODln72cRws6dO5sTwTmEQlPDAMBYNed/h91BbtjGkXQ8OVs5ZNle7c36p+91io67RsqyDEW/+3T/oNhB5qadN3f8yxaPiiAAMA5XqurVj0yfGtaAsHpFGvZqdzNOHxT9JoDx5Uvb0oPT6mB0086be+0Jq/gY71+SQS0wEgQBgHHqer/gDYJjWhRMGz4Pz2fVE2mj6b179sR3OXb0WK9Z9FIRVkMIYXnfvvMXzld3rmv62KH/e4XrXwhzGgS799doNYleGN0dOHBg7OecmnvbmsJ8rK3Vy71tL29tyvJkW6uX1nO2dopp9bcXWl7+M+Wl5mBbP5x55DsP06RTzPTUin8b7AWpFQWv0EemXXMJYLS8b7k6z7GjR5f37QuNWJmGwkxSYJjbIAgAbFHtnZ+bea4ZCjeYR25/oxD6obC9rNf22pgC6wf2Q+HvH/p/w95uIdksAgBMQOtekGGG9ResTtZIelc8dfvpNmxPmM/SwIqKIAAwVh3zX2v36Y7v0OGA4csJG1tVMqYiCABMQBGbtRQDZbYrVf6uqGwLcLWe0o3i4RUy3wZbRhaeIAgAjMfQqdXmHeTSp2q/XmmklgVb7yyStJJJn64vVUwbx4Q8bi5cIwgCAOPRC1JpC+hy7crpaljFLomAm1q9d4VDh+xczjAFhimvEXz55Zebg7fffnvHl2+VBhmtf+ZTTz3V8eUPPvhg12sazfNtjVWONppthhB+u62nzMG2/i9Pth35nc6dYn67rdHMX5xrefnRtZaXv1W0tp9p6SkzNb7zXUztOz8JupB08e1vf3uG7+7/R1M1LNJVy/I2Py9cFOtFqzKURe9U1Y/B948vCSGE8IWHP/elP/mzju+Y7eywzSIAwJg0U1ftZnHVYNvu3fUo1la06x7UvvCFz290hcPvWWLXMADACIb1hQ6Ne8o1FKHo3RWkbF+3V4SidbNI5Y83iIDpJQ159yu/duEIggDAWA2bAk77tjRuHFKGcj2KdV7Al+4RvvvAvY9/+av9ExS//mu/OuxsrScXBAEARrNB6mrdOxzrc2UZ0rQ35CSvv/7GwEv7D+4+cG+sFMYbCocQyrKsQmH9AgbOkGP4SwmCAMCYlGVRLA1U72rZq3XJYHOuNr4qqR2+8fpPh73nXfd8oCzLKgL2TzlkEnmDmx1nSfsYAGAMfu93fycU6xs+il5H6SRp9NpLF73HIWkQk1YK02P6hy0v711e3lt7x7sO3HvXgXuLoqhiX9EXH3ffMnx1f/ICmFRFcP/+/c3BI0eOdHx59/4aI9qxY0fHIx955JFR3mgOG2T81he/2Bz8q499rDnY2sAljNYpZl/bv4O0v1Gb1k4xF1daOsW0/pmT4DtfM4ffeRaeTjEz93u/+zvxwZf+5M/KUK6nvdrqwFjta50mjoYUDpeX96anOnH8aHxm7/Jt6WmqUNhycneWG2RqGAAYs9/73/+revylP/3zEAbniGMaK9tWBDaDWjVSe1Xy+PixH8cHe/bu23hb8cCJ0+0p/ZGOr10YgiAAMEGxTPj4l7968sTxEMPWBsmvtSjYPKB163FRVDXCPXv3DbzFhnPEzUSYD0EQAJigJ77ytVil27Vnb5yufe34sbJcCyGZJg5hfb64qTaYpsDW3oRJImx5YW1ssE9hxz9qYQiCAMBEPPGVr8UHtT28u/cuV49PHPtx2kGmZb44PtXapLpRF1zfs5yeJ92VnB4ciqoWmG0rQUEQABi/KgVGw/q57Onv82iv4YXhN6ZrqwvGQmNRLIWi6BUd03Jj89z9+9rFB9YIAgCMJI2AcS64fRtvCPGpOF6t6us+q9uyK7koQln2ImDz5bXU2Bb7HvrM50MIf/SZTw754xbNVIPgiP01ujt27Fhz8JVXXhnlnJn0wujeU+ZzbZ1irtve0tXlZ8qWri5HG/+Qhs00hQlhlp1iuvOdhwnRKWY+1aqATa1FwSoLRlUiLMvytRP9/3JrXTvY3GgybPlgdfxgz5qqIpjuFymK4tN/+HB1DYsdClUEAYAxqFJgWv9bW+v9e/96k+e+DcqE1bO79/RWE/YSYW3lX//QgfxXKxMOnjSuI1wfGCwK9kLh4N3qFrtGKAgCAGPQ2/aRpLcwPOdVWu8Ol74wPjVQJjx+dCDnte4pDoOpsaoFDk4c13aHVL+WZVld0uWV8wu8clAQBABG8gcPfTaEsHv3LfHX1+Iiv6IIZbl337urw9bW1mrxrva4+Wx1v7h0fPfefXGwfTXhsIpgY9dItWt4YL/I4ITy5UsXFjgFBkEQALhqcdp0aanttqEhhKI4fvRH8UEsE9aWAw6rF8YaYTMC1lSlx9iqOsS53Q22lQz5dX11YFIgvLxyPoTF30UsCAIAVyOmwKi3FrD1DsIhhFgm7I/v6Zf0NlA7oFYsrE0lDzQmjGXCZvfB5AW9A5KiYEj2i6QRsAihDIvcXVAQBAA2J42AIdkR0j4tW9vDEVcThhCKYuBGcH3NmeJUrUzYPKbehqa1j2BRhKKo7eTJvgUAAAvPSURBVBR5881zIYTVSxd6h4RQ9uPgAtcFZx8Eu/fXaO2F8eKLL3Z8I70wrlr3tiytjWYubuKttkZTmBH5zsOm6BQzb2opsHLy5OkQwq5bbw5FUS28q98aeHCrby8R9ttKN7eM1NQy4sZlxQvnz8dreMc7bli/kv78b1muVRPBb719fm1t7fKlC/H3sp8CN76YxTD7IAgAbCGXL18s18oQwrXbr48jS0tLVUQ7eer16shdu3a2n6Lf+TmEXj5bv9Fccq+RMHg/ko0rhSEpEP7gP78fkqne8+fPVcH0He+4YSChhvDW2+dXLp4LtfBXFEVt0/GCEgQBgE2IKbBYKi6tXCiWenFq27btvWeTuHaqHwp33bpzYB62miwuk70d/QfVxPHe5dtC273pmhtH4m6V2PPlB69+v/cm/fV/MQ4WoXjr7fNvv30hHrZ79y1n3jwbkrng6rKr9+gtEFzcFBgEQQBgs4qiiLmuCoWrqyvx123XbK8Oqzozn3jtVBzZvfuWejmwcYO46tnjR38UkrvPXXF+9oevvlI1guldZz8LvvX2+dolnTx5erXfGqa6D17RPyadIw7WCAIARLEKGCNglD5evbwSH1xz7XXVYNVf5lQycXzrrTeHMJgF01+Tn1WNMCR7QVKvvvIf65c3uMf3zTfPxXdPlxWuXDibHB//hoEJ6PWdwgs9LxwEQQBgU6rYV0uEvYpdP4atrq5UT127/fpaPa8syyoUrifC5OmBbSXJgxP924pUiTCuCBw4eb8uGCd/q3eM13DxwtlisNpX9CeCB+ahYy/DhS4HBkEQALh65Xp26iWtOGVcltVNQcqyvLRyIT6+dvv1tRV+a2trr732k/h4d9xckkbA2qbjZE1hTITnL5xPS4DrG4HfOh8aNyaJhcCin/Cqat/6NuGyLPqJsLr33R9/oX2X9GKY0yDY2l9jxCOZgsVr9TI1vvMQdIrZItarZv2ey0U/gNWqg+nGkfh45WJvrV664zg+WFtbO/WTN6rjb7nlpvZ20GE9wBXFUm0iOIQQlwM2FxReuniu7K1ujIE12SIcBkJh6G8Q+cLDn+vygWxpcxoEAYD5VO236P+e/Bw8JvSnj8N6976yWCpCGS5fWm8yu7Tt2vggNqaOZbyf9EPhLbfctH7ewT7VZbkW+m1i4s+3zw5sAY5id5gQy37x4tMNK0ktsPojyhAWuxBYEQQBgE2I5b1aV7968utPEKf7SHoTtf06Ym/HcVGsXl6JJ6l2HMdEGM8ZE+Hq6mqIm45Dsmqw6PWFKUN59mwvWaYXtnLxXNGsDdaOS/6oWCn8Qh4RMBIEAYDNScNfbTlgupVkPfaFUJs7josLqxPGU6VlwioUxqeWlpbiasI4lRz3l8Qq45tv9Qt+g5EvpsBeR8Ak59VuH5IWAnOYC64RBAGAkaT3/E2njAduGRfqfaGrJ6pQmBbz1lYvxdMuLV2XnjkOnjr1evVGMSOmF3Bp5Xy11WO9NWDya+hvGS76L1n4TSHDCIIAwCY8/Pk/qh5/4pMPhf4tPeJIOkc8UBFMMmLvmIF2Mb3G1L1fkwnlqkxYqxGmlcKwXlO8ENb3L68v+4sRsrcpJITaZuE/zq8QWBEEAYCrVIXCj3/iU7WnqiWAVb++apdJ/zZujdOtp7YQ0vncEMqyvHzpYnW2eEe7sizj2sF48OVLF3pvEdYDaW0iuLZZOKvlgK0EQQBmQKeYBfOFhz9bPY6hsL6tOJ3bbdybpHdgvytNc/ngejVxrYz7S+Kvccfx5cH7BQ+sS0xmhIvkACkwEgQBgHGqQuHHP/GpqoNges+O9WJh/HXIBuQqMqYvqR2zenmlWVosknbQRdI7urqbSJ7LAVsJggDARFSJ8BOffCgUobZksCkmv3TbRy//xcHavuP0VbHIV7UGTLeGJPcjKYoiw33BGxMEAYDJau4vCY1CYGj0HQxVz8K1linjgRJjlQL7lb/1nSJJTJQCmwRBAGB6qlBY7ThOn60tH0ynlWMKrE0oF0UR0sY01WaRwZ0n5oKHEQQBgBlIy4S9/SVJCky7BobB5YO9kaWiXCvXO9cMBsr1HtEi4IYEQQBgxtL9JWEwEVYtButlwtBbOFj2GsislwCrFKgQeEVjCIIHDx5sDh46dGj0M7Mxn/ys+ORhU3SKobt6IuwvBKx2jYQwuEu4HJgIrh6IgB2pCAIAcydtTPiJTz7Uv1lIvUBYFEUaC3t3CpECOxMEAYC5Vrt/SdVccL3RjB7RV0sQBAC2htrEcZnsEVYFvDqCIACwxQzc0e7jn1QIvGpLs74AAICrJwWOQhAEAMjUGKaGn3zyyY6DXLXWfiU++Snwyc9K6yevCwnAeKkIAgBkShAEAMiUIAgAkClBEAAgU4IgAECmBEEAgExN6s4ira0fuGqHDh1qDrb2K/HJj5dPflZaP/nDhw9P/0oAFpiKIABApgRBAIBMCYIAAJkSBAEAMiUIAgBkShAEAMiUIAgAkClBEAAgU4IgAECmBEEAgEwJggAAmRIEAQAyJQgCAGTqmllfwJZx5MiRjkfu379/oleSG5/8rPjkYeYOHjzYHDx06ND0r4RFpSIIAJApQRAAIFOCIABApgRBAIBMCYIAAJkSBAEAMpVR+5juvTBa3X///R2PfPbZZ5uDy8vLo7z7luaTnxWfPGx19913X3Pw8OHD078SFpWKIABApgRBAIBMCYIAAJkSBAEAMiUIAgBkShAEAMjUVmofM4leGHfeeeco5+xuS/fX8MnPik8egIlSEQQAyJQgCACQKUEQACBTgiAAQKYEQQCATAmCAACZmmr7mC3dC6O77pc0tf4aPvkan/x4zeEnD0AXKoIAAJkSBAEAMiUIAgBkShAEAMiUIAgAkClBEAAgU5NqH9PaNeOxxx5rDr700ksTuoZZueOOOzoOtjbdePTRR0d5d598l0Gf/HjN9pMH4KqpCAIAZEoQBADIlCAIAJApQRAAIFOCIABApgRBAIBMTap9TKvHH3+8OfjAAw80B2fbX6O17UV3rRff2iDjwIEDzcGnn356lHdv5ZOv8cnXLN4nD0AXKoIAAJkSBAEAMiUIAgBkShAEAMiUIAgAkClBEAAgU1NtH9NqEv01JtEL44knnmgOnjlzpuM5d+zYMcolTYJPflZ88gDMCRVBAIBMCYIAAJkSBAEAMiUIAgBkShAEAMiUIAgAkKnZt49p1b2/RqtJ9MLo7sCBA2M/59T45GfFJw/A9KkIAgBkShAEAMiUIAgAkClBEAAgU4IgAECmBEEAgExNtX3Myy+/3By8/fbbO758qzTIaP0zn3rqqY4vf/DBB7teU2c++S588jVb+pMHoAsVQQCATAmCAACZEgQBADIlCAIAZEoQBADIlCAIAJCpSbWP2b9/f3PwyJEjHV/evb/GiHbs2NHxyEceeWSUN5pagwyffI1PvmbxPnkArpqKIABApgRBAIBMCYIAAJkSBAEAMiUIAgBkShAEAMjUpNrHtBqxv0Z3x44daw6+8soro5xzS/fC8MnPik8egHmmIggAkClBEAAgU4IgAECmBEEAgEwJggAAmRIEAQAyNdX2Ma2699do7YXx4osvdnwjvTBqfPKz4pMHYE6oCAIAZEoQBADIlCAIAJApQRAAIFOCIABApgRBAIBMzb59TKvW/hojHkkXPvlZ8ckDMH0qggAAmRIEAQAyJQgCAGRKEAQAyJQgCACQKUEQACBTgiAAQKYEQQCATAmCAACZEgQBADIlCAIAZEoQBADIlCAIAJCpa0Y/xcGDB5uDhw4dGv3MbMwnPys+eQAWg4ogAECmBEEAgEwJggAAmRIEAQAyJQgCAGRKEAQAyFTxl3/5lx/60IeaT7z++uvTvxoAAMbu9OnTzcFjx46pCAIAZEoQBADIlCAIAJApQRAAIFOCIABApgRBAIBMCYIAAJkSBAEAMiUIAgBkShAEAMiUIAgAkClBEAAgU4IgAECmimeeeeaFF15oPrG8vDz9qwEAYOyOHTvWHHzf+96nIggAkClBEAAgU4IgAECm/j8t8gVGgBjojAAAAABJRU5ErkJggg=="
  alt="">
<h2 id="手持照明与染色" data-toc-id="手持照明与染色">手持照明与染色</h2>
<p>右键切换开关，主副手都能照明；双手各拿一支时只点亮一支（优先主手），也只扣那支的电。放回背包、掉落、死亡或旁观时自动停止照明，开关状态保存在物品里。
</p>
<p>手电筒 + 任意一种染料无序合成即可改光色，一次只接受一种染料，开关、电量、名称都保留；支架和舞台灯则直接用染料右键染色。默认光色为暖白
  <code>#FFF2D6</code>。</p>
<p>另一只手拿着电池时右键优先补电；想切换开关先把电池收起来，对空气操作可以避免触发方块交互。</p>
<h2 id="电量与电池" data-toc-id="电量与电池">电量与电池</h2>
<p>电量限制默认开启，悬停物品即可看到“电量：当前 / 最大”。电量存在物品组件里，不是耐久——任何状态都不显示耐久条。每 20
  游戏刻扣一次电，耗尽自动关灯，补电前无法再打开。默认满电 1000、每秒耗 1，约合 16 分 40 秒；一块电池恢复
  250。支架中的手电筒和舞台灯不耗电。</p>
<ol>
  <li>
    <p>一手拿电池，另一手拿手电筒，对空气右键补电；生存模式每次消耗一块电池。</p>
  </li>
  <li>
    <p>成功后快捷栏上方提示当前电量；补电有短暂冷却，电量不会超过上限，超出部分不保留。</p>
  </li>
  <li>
    <p>补电保留光色与开关状态，不会自动开灯。</p>
  </li>
</ol>
<p>电量相关配置在 <code>config/flashlight-battery.toml</code>，由服务器统一并向客户端同步：</p><pre language="toml" isclosed="false"><code class="language-toml">[battery]
enabled = true
capacity = 1000.0
drain_per_second = 1.0
battery_restore = 250.0</code></pre>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr>
      <th>配置项</th>
      <th>默认值</th>
      <th>作用</th>
    </tr>
    <tr>
      <td>enabled</td>
      <td>true</td>
      <td>false 时不再扣电，空电也能开灯，并隐藏电量文本</td>
    </tr>
    <tr>
      <td>capacity</td>
      <td>1000.0</td>
      <td>最大电量，1～1000000000</td>
    </tr>
    <tr>
      <td>drain_per_second</td>
      <td>1.0</td>
      <td>每 20 游戏刻耗电量；0 表示不耗电但仍显示电量</td>
    </tr>
    <tr>
      <td>battery_restore</td>
      <td>250.0</td>
      <td>单块电池恢复量；0 表示不能补电</td>
    </tr>
  </tbody>
</table>
<h2 id="手电筒支架" data-toc-id="手电筒支架">手电筒支架</h2>
<p>拿着手电筒潜行右键坚固方块的表面即放置，保留光色、开关、电量和名称；生存模式消耗该手电筒。墙面放置朝点击面外侧照射，顶面或底面放置沿玩家水平朝向照射。
</p>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr>
      <th>操作</th>
      <th>效果</th>
    </tr>
    <tr>
      <td>空手右键</td>
      <td>切换内部手电筒开关</td>
    </tr>
    <tr>
      <td>潜行 + 空手右键</td>
      <td>取回手电筒并移除支架</td>
    </tr>
    <tr>
      <td>染料右键</td>
      <td>改光色，生存消耗一份染料</td>
    </tr>
    <tr>
      <td>破坏</td>
      <td>掉落内部保存的原手电筒</td>
    </tr>
  </tbody>
</table>
<p>支架照明不受电量限制。用 <code>/setblock</code> 直接生成的支架为空，不会自动带入手电筒。</p>
<h2 id="舞台摇头灯" data-toc-id="舞台摇头灯">舞台摇头灯</h2>
<p>放置后默认开启，朝放置者水平朝向、俯仰角向下 15°。空手右键打开配置菜单，参数实时生效；潜行 +
  空手右键直接切换电源；染料右键改色。每盏灯独立保存设置，不耗电，也不受手电筒全局配置影响。</p>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr>
      <th>参数</th>
      <th>默认值</th>
      <th>范围或说明</th>
    </tr>
    <tr>
      <td>自动摇头</td>
      <td>关闭</td>
      <td>围绕基础水平角左右摆动</td>
    </tr>
    <tr>
      <td>红石控制</td>
      <td>关闭</td>
      <td>开启后需邻近红石信号且电源已开才照明</td>
    </tr>
    <tr>
      <td>光色 RGB</td>
      <td>#FFF2D6</td>
      <td>六位十六进制，或用染料</td>
    </tr>
    <tr>
      <td>亮度</td>
      <td>100</td>
      <td>1～300</td>
    </tr>
    <tr>
      <td>距离</td>
      <td>24</td>
      <td>4～48 格</td>
    </tr>
    <tr>
      <td>光束半角</td>
      <td>15°</td>
      <td>2～60°，越小越集中</td>
    </tr>
    <tr>
      <td>空气光束</td>
      <td>0.35</td>
      <td>0～1；0 隐藏空气光束，仍照亮表面</td>
    </tr>
    <tr>
      <td>水平角 / 俯仰角</td>
      <td>朝向 / 15°</td>
      <td>-180～180°（0 朝南）/ -90～90°（正向下）</td>
    </tr>
    <tr>
      <td>摇头幅度</td>
      <td>45°</td>
      <td>0～180°，相对基础水平角的单侧幅度</td>
    </tr>
    <tr>
      <td>周期</td>
      <td>6 秒</td>
      <td>0.5～120 秒，一次完整往返</td>
    </tr>
    <tr>
      <td>相位</td>
      <td>0°</td>
      <td>0～360°，调整多盏灯之间的运动偏移</td>
    </tr>
  </tbody>
</table>
<p>相同周期与相位的灯同步摆动；想让两盏灯反向摆动，把相位分别设为 0° 和 180°。</p>
<h2 id="配置速查" data-toc-id="配置速查">配置速查</h2>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr>
      <th>文件</th>
      <th>内容</th>
    </tr>
    <tr>
      <td>config/flashlight-server.toml</td>
      <td>手持、支架、枪灯、肩灯的全局照明参数</td>
    </tr>
    <tr>
      <td>config/flashlight-battery.toml</td>
      <td>电量开关、容量、耗电与电池恢复量</td>
    </tr>
    <tr>
      <td>config/flashlight-compat.toml</td>
      <td>TaCZ、Curios 联动与枪械白名单</td>
    </tr>
  </tbody>
</table>
<p>保存合法修改后自动生效并向在线客户端同步，也可在 NeoForge 模组配置界面中调整。全局照明参数：</p><pre language="toml" isclosed="false"><code class="language-toml">[flashlight]
range = 18.0
intensity = 80.0
inner_angle = 12.0
outer_angle = 22.0
volumetric = 0.15</code></pre>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr>
      <th>配置项</th>
      <th>默认值</th>
      <th>范围与作用</th>
    </tr>
    <tr>
      <td>range</td>
      <td>18</td>
      <td>4～48，照明距离（方块）</td>
    </tr>
    <tr>
      <td>intensity</td>
      <td>80</td>
      <td>1～300，聚光灯强度</td>
    </tr>
    <tr>
      <td>inner_angle</td>
      <td>12</td>
      <td>1～60，中心亮区半角；不得大于 outer_angle，否则保留上一份有效参数</td>
    </tr>
    <tr>
      <td>outer_angle</td>
      <td>22</td>
      <td>2～80，光束边缘半角</td>
    </tr>
    <tr>
      <td>volumetric</td>
      <td>0.15</td>
      <td>0～1，空气光束强度，0 关闭</td>
    </tr>
  </tbody>
</table>
<h2 id="tacz-枪灯" data-toc-id="tacz-枪灯">TaCZ 枪灯</h2>
<p>安装 TaCZ 1.21.1 NeoForge 社区移植版（1.1.8-hotfix-r7）后，在
  <code>config/flashlight-compat.toml</code> 中开启联动并逐把添加枪械——默认白名单为空，只改
  <code>enabled</code> 不会对任何枪生效：</p><pre language="toml" isclosed="false"><code class="language-toml">[compatibility.tacz]
enabled = true
gun_mounts = ["tacz:glock_17 0 0 0 0 0 0 0.6"]</code></pre>
<p>手电筒装在 TaCZ 原生改装界面的激光配件槽（与其他激光配件互斥），枪必须拿在主手才照明。用<a
    href="#枪灯与肩灯快捷键">联动快捷键</a>开关，或安装前先手持右键开启。拆装保留颜色、开关、名称和电量。</p>
<p>每项白名单由枪械 ID
  和七个数值组成：<code>枪械ID 横向偏移 上下偏移 前后偏移 水平角 俯仰角 滚转角 缩放</code>。偏移为模型像素（-64～64），角度单位为度（-360～360），缩放
  0.1～2。挂点跟随枪包的 <code>laser_pos</code> 激光配件位置，不同枪需要逐把校准，不能套用同一组参数。</p>
<h2 id="curios-肩灯" data-toc-id="curios-肩灯">Curios 肩灯</h2>
<p>安装 Curios 后，把 <code>flashlight-compat.toml</code> 中的开关改为 <code>true</code>
  并保存：</p><pre language="toml" isclosed="false"><code class="language-toml">[compatibility.curios]
enabled = true</code></pre>
<p>保存后自动添加“肩部手电筒”功能槽，无需重进世界。把手电筒放入该槽即佩戴在右肩，解放双手，第三人称可见实物；用<a
    href="#枪灯与肩灯快捷键">联动快捷键</a>开关。补电时取下按常规方式补，再戴回。把开关改回 <code>false</code>
  后槽位自动移除，已佩戴的手电筒退回背包。</p>
<h2 id="枪灯与肩灯快捷键" data-toc-id="枪灯与肩灯快捷键">枪灯与肩灯快捷键</h2>
<p>在“选项 → 控制 → 按键绑定 → 手电筒”中为“切换枪灯 /
  肩灯”指定按键（默认未绑定）。该键只控制主手枪灯和肩灯，不管手持手电筒、支架和舞台灯。枪灯与肩灯同时装备时统一切换：有一支开着就全部关闭，全关时点亮有电的灯；空电的灯不会被强行点亮。
</p>
<h2 id="create-aeronautics-移动结构" data-toc-id="create-aeronautics-移动结构">Create
  Aeronautics 移动结构</h2>
<p>
  放置在移动结构上的支架和舞台灯会自动转换光源坐标：结构移动、转向或倾斜时，光斑位置和照射方向随之变化，舞台灯仍可独立摇头，靠近后照常打开菜单调整。无需额外配置；未安装这组模组时灯具照常独立使用。
</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">已知限制</div>
  <div data-type="admonition-content">
    <p>移动结构暂未接入 Photon 的阴影体素，船体等方块可能无法遮挡光束；Sable 2.0.6 不兼容 Sodium 0.6.13，Iris
      亦有显示问题，本页功能以原版渲染验证。</p>
  </div>
</div>
<h2 id="指令速查" data-toc-id="指令速查">指令速查</h2><pre language="plaintext" isclosed="false"><code class="language-plaintext">/give @s flashlight:flashlight
/give @s flashlight:battery 4
/give @s flashlight:mounted_flashlight
/give @s flashlight:stage_light</code></pre>
<p>光色组件 <code>flashlight:light_color</code> 为 24 位 RGB 十进制（0～16777215），电量组件
  <code>flashlight:charge</code> 为数值，开关保存在 <code>minecraft:custom_data</code> 的
  <code>flashlight_on</code> 中：</p>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/give @s flashlight:flashlight[flashlight:light_color=16728128]
/give @s flashlight:flashlight[flashlight:charge=250.5]
/give @s flashlight:flashlight[flashlight:light_color=16728128,flashlight:charge=250.5,minecraft:custom_data={flashlight_on:1b}]</code></pre>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr>
      <th>颜色</th>
      <th>十六进制</th>
      <th>指令数值</th>
    </tr>
    <tr>
      <td>暖白（默认）</td>
      <td>#FFF2D6</td>
      <td>16773846</td>
    </tr>
    <tr>
      <td>红色</td>
      <td>#FF4040</td>
      <td>16728128</td>
    </tr>
    <tr>
      <td>绿色</td>
      <td>#40FF70</td>
      <td>4259696</td>
    </tr>
    <tr>
      <td>蓝色</td>
      <td>#4080FF</td>
      <td>4227327</td>
    </tr>
    <tr>
      <td>白色</td>
      <td>#FFFFFF</td>
      <td>16777215</td>
    </tr>
  </tbody>
</table>
<h2 id="常见问题" data-toc-id="常见问题">常见问题</h2>
<h3 id="手电筒开启了但没有光" data-toc-id="手电筒开启了但没有光">手电筒开启了但没有光</h3>
<p>确认客户端装有 Photon 和 KilaGraph、Photon
  动态光照已开启、玩家不是旁观模式；开了电量限制就检查剩余电量。只在特定光影包下异常时，检查该客户端的渲染配置。</p>
<h3 id="右键只补电不切换开关" data-toc-id="右键只补电不切换开关">右键只补电不切换开关</h3>
<p>另一只手拿着电池时右键永远优先补电，把电池收起来再操作；点击容器等方块会触发方块交互，对空气操作即可。</p>
<h3 id="装了-curios-却没有肩部槽" data-toc-id="装了-curios-却没有肩部槽">装了 Curios 却没有肩部槽</h3>
<p>装模组只是前置，还需把服务器或单人实例的 <code>compatibility.curios.enabled</code> 设为
  <code>true</code> 并保存；正常情况下无需重进世界。</p>
<h3 id="枪装不上手电筒" data-toc-id="枪装不上手电筒">枪装不上手电筒</h3>
<p>依次检查 TaCZ 版本、联动开关、<code>gun_mounts</code> 白名单（要用枪械 ID 而不是物品
  ID）、原生激光槽和改装锁。位置不合适就逐把调整偏移、角度和缩放。</p>
<h3 id="舞台灯不亮或没有空气光束" data-toc-id="舞台灯不亮或没有空气光束">舞台灯不亮或没有空气光束</h3>
<p>检查菜单里的电源；开了红石控制还需邻近红石信号。能照亮表面但看不到光束时，检查“空气光束”是否为 0 以及 Photon 的体积光设置。</p>
<h3 id="配置保存后没生效" data-toc-id="配置保存后没生效">配置保存后没生效</h3>
<p>确认改的是当前实例或服务器的文件、TOML 分组不重复、数值在范围内、照明内半角不超过外半角；无效配置会在日志中提示，修正后重新保存即可。</p>