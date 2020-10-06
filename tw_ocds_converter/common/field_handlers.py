from tw_ocds_converter.utils.mutation import address_value
from tw_ocds_converter.utils.mutation import raw_value

field_handlers = {
  '採購資料:標案案號': { 'tender.id': raw_value },
  '採購資料:標案名稱': { 'tender.title': raw_value },
  '機關資料:機關地址': { 'parties[].address': address_value }
}