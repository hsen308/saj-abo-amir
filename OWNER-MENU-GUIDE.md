# Editing the menu (for the owner)

You do this from your phone, in the Google Sheets app. No codes, no passwords, no admin panel.

## First time only: one-time setup by Novu

Already done for you. Skip to "Changing a price".

## Changing a price

1. Open the menu spreadsheet on your phone (the Google Sheets app, or the Sheets website).
2. Tap the cell in the `price` column for that item.
3. Type the new price, for example `25k`.
4. Tap Save / Done.

That is it. Close and reopen the website and the new price is there.

## Adding an item

1. Tap the last row of the table.
2. Tap the `+` button to add a row.
3. Fill in the columns.

| Column | What to put |
| --- | --- |
| `show` | `yes` |
| `category` | `saj`, `kaake`, `sandwiches`, or `drinks` |
| `name_en` | The name in English |
| `name_ar` | The name in Arabic |
| `price` | `25k` or whatever, or leave empty to hide the price |
| `desc_en` | Short ingredients in English |
| `desc_ar` | Short ingredients in Arabic |
| `tags` | Only for healthy items: `protein`, `lowcarb`, `light` |
| `id` | Copy an existing `id` and change the end of it, for example `mylunch-1` |

The `id` column is what keeps your item matched up when it moves between sheets. Make it unique.

## Removing an item

Do **not** delete the row. Change `show` to `no`.

That way the item is hidden from customers but you can bring it back by setting `show` back to `yes`.

## Good to know

- **Kaake items are separate rows.** A Saj called `cheese` and its Kaake version `k-cheese` are two rows. They look identical on screen but the names and prices are independent. Change one, the other does not follow.
- **Commas are fine.** `Cheese, tomato, onion` works as-is.
- **Leave the header row alone.** The first row must keep the exact column names `show, category, name_en, name_ar, price, desc_en, desc_ar, tags, id`. If you delete or rename those, the website stops reading the sheet and shows the old prices again.
- **Nothing is secret in the sheet.** Only the menu goes in it. Do not put your WhatsApp number, prices you do not want public, or anything private in this spreadsheet, because anyone can read the published link.
- **If prices look stale,** wait a few minutes. Google caches published sheets. After that it refreshes on its own.