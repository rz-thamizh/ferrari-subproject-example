import { gql } from '@apollo/client';

export const AllWidgetsQuery = gql`
query widgetIds {
  widgetIds {
    id
  }
}
`;

export const AllWidgetsByThemeQuery = gql`
query widgetIdsByTheme($id: Int!) {
  widgetIdsByTheme(id: $id) {
    id
  }
}
`;

// Strange html attribute is not coming when it used with fragement
export const WidgetDataFields = gql`
fragment WidgetDataFields on WidgetData {
  html
  id
  theme_id
  title
  type
  store_ids
  sort_order
  page_groups {
    page_id
    page_group
    page_for
    layout_handle
    block_reference
    page_template
    entities 
  }
  parameters {
    name
    value
  }
}
`;

// Strange html attribute is not coming when it used with fragement
export const WidgetListQuery = gql`
query widgetList($ids: [Int!]){
  widgetList(ids: $ids) {
    html
    id
    theme_id
    title
    type
    store_ids
    sort_order
    page_groups {
      page_id
      page_group
      page_for
      layout_handle
      block_reference
      page_template
      entities 
    }
    parameters {
      name
      value
    }
  }
}
`;

// Strange html attribute is not coming when it used with fragement
export const WidgetsQuery = gql`
query widgets{
  widgets {
    html
    id
    theme_id
    title
    type
    store_ids
    sort_order
    page_groups {
      page_id
      page_group
      page_for
      layout_handle
      block_reference
      page_template
      entities 
    }
    parameters {
      name
      value
    }
  }
}
`;

// Strange html attribute is not coming when it used with fragement
export const WidgetsByThemeQuery = gql`
query widgetsByTheme($id: Int!) {
  widgetsByTheme(id: $id) {
    html
    id
    theme_id
    title
    type
    store_ids
    sort_order
    page_groups {
      page_id
      page_group
      page_for
      layout_handle
      block_reference
      page_template
      entities 
    }
    parameters {
      name
      value
    }
  }
}
`;
