# Social housing map

## How to Use?

### 1. Covert to OCDS

```shell
node index.js convert_to_ocds --org 3.80.11 --c 1090212-B2
```

You should be able to see results like the following

```shell
{
  date: '1595376000000',
  id: 'TIQ-1-52845290',
  ocid: 'ocds-kj3ygj-TIQ-1-52845290',
  tag: 'tender',
  language: 'zh',
  initiationType: 'tender',
  buyer: { id: '3.80.11', name: '桃園市政府工務局' },
  parties: {
    additionalIdentifiers: { legalName: '桃園市政府住宅發展處住宅開發科' },
    address: {
      locality: '桃園市',
      region: '桃園區',
      postalCode: '330',
      countryName: '臺灣',
      streetAddress: '330桃園市桃園區力行路300號'
    },
    contactPoint: {
      name: '梁如中先生',
      telephone: '(03)3324700分機2216',
      faxNumber: '(03)3335772',
      email: '10021540@mail.tycg.gov.tw'
    }
  },
  tender: {
    id: '1090212-B2',
    title: '桃園市社會住宅(略)家具租賃服務案(詳附加說明)',
    mainProcurementCategory: 'goods',
    minValue: { currency: 'TWD', amount: '274,736,297元' },
    procurementMethod: 'open',
    awardCriteria: '最有利標',
    tenderPeriod: { startDate: '109/07/22', endDate: '109/07/30 09:00' },
    submissionMethod: 'written',
    submissionMethodDetails: '親送或寄達桃園市政府7樓工務局採購管理科收',
    eligibilityCriteria: '(一)廠商基本資格:\n' +
      '1.投標廠商應符合下列其中1項基本資格：\n' +
      '(1)家具及裝設品製造業(CN01010)\n' +
      '(2)家具、寢具、廚房器具、裝設品批發業(F105050) 。\n' +
      '2.本工程允許單獨投標或共同投標：\n' +
      '(1)單獨投標：符合本點所列其中1項廠商基本資格者得單獨投標。\n' +
      '(2)共同投標：代表廠商廠商須符合本點所列其中1項基本資格，得採共同投標。\n' +
      '(二)應檢附之文件:\n' +
      '因採購網字數限制，詳公告附加說明或投標須知'
  }
}
```

#### Some Great Examples

TODO: We should just turn these into tests

- Award: Two suppliers for different items

```shell
node index.js convert_to_ocds --org_id="3.95.29.3" --contract_id="P1080312"
```

- Award: Three suppliers for one items

```shell
node index.js convert_to_ocds --org_id="3.79" --contract_id="1070807C0140"
```

- Award: Failed （廢標）

```shell
node index.js convert_to_ocds --org_id="3.79.56" --contract_id="1070717C0129-01"
```

### 2. Search for titles and filtered by unit IDs

```shell
# --title, -t        The title to search for                 [string] [required]
# --unit_ids, --uid  The unit ID to filter with               [array] [required]
node index.js search_with_unit --t '舊宗' --uid '3.79.56' '3.79'

======== Procurements ========
{ '1070807C0140':
   { tender_api_url:
      'http://pcc.g0v.ronny.tw/api/tender?unit_id=3.79&job_number=1070807C0140',
     title: '臺北市內湖區舊宗公共住宅新建工程' },
  '1080531SC012':
   { tender_api_url:
      'http://pcc.g0v.ronny.tw/api/tender?unit_id=3.79&job_number=1080531SC012',
     title: '臺北市中山區錦州及內湖區舊宗公共住宅新建工程委託耐震特別監督技術服務案' },
  '1070711PH':
   { tender_api_url:
      'http://pcc.g0v.ronny.tw/api/tender?unit_id=3.79.56&job_number=1070711PH',
     title: '臺北市內湖區舊宗公共住宅新建工程' },
  '1060420SC003':
   { tender_api_url:
      'http://pcc.g0v.ronny.tw/api/tender?unit_id=3.79&job_number=1060420SC003',
     title: '臺北市內湖區舊宗段公共住宅新建工程委託規劃設計暨監造技術服務案' },
  '10603241TIA':
   { tender_api_url:
      'http://pcc.g0v.ronny.tw/api/tender?unit_id=3.79.56&job_number=10603241TIA',
     title: '106年公共住宅(培英、錦州街、舊宗段、河濱等四筆基地)交通影響分析專業服務案' } }
Total: 5 matches.

# --title, -t        The title to search for                 [string] [required]
# --unit_ids, --uid  The unit ID to filter with               [array] [required]
# --regex, -r        Additional regex to filter the title               [string]
node index.js search_with_unit --t '舊宗' --uid '3.79.56' '3.79' --r '監督'
======== Procurements ========
{ '1080531SC012':
   { tender_api_url:
      'http://pcc.g0v.ronny.tw/api/tender?unit_id=3.79&job_number=1080531SC012',
     title: '臺北市中山區錦州及內湖區舊宗公共住宅新建工程委託耐震特別監督技術服務案' } }
Total: 1 matches.
```

### Jest Test 
Please make sure to install with npm first and run
```
npm run test 
```

you'll see results like the following 
```
 PASS  tests/put.test.js
  ✓ put value into simple path (1 ms)
  ✓ put value into array
  ✓ put value into array with index
  ✓ put value into object in an array (1 ms)
  ✓ put value into object in an array, merging would work instead of creating new obj

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        1.181 s
```




## Yo

To add new dependency X: `npm install --save X`. And it will update `package.json`.
Otherwise, just `npm install`
