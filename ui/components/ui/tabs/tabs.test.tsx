import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Tabs from './tabs.component';
import Tab from './tab/tab.component';

describe('Tabs', () => {
  const renderTabs = (props = {}) => {
    const defaultProps = {
      defaultActiveTabKey: '',
      onTabClick: () => null,
      tabsClassName: '',
      subHeader: null,
    };
    return render(
      <Tabs {...defaultProps} {...props}>
        <Tab tabKey="tab1" name="Tab 1">Tab 1 Content</Tab>
        <Tab tabKey="tab2" name="Tab 2">Tab 2 Content</Tab>
      </Tabs>,
    );
  };

  it('renders the tabs component', () => {
    const { getByText } = renderTabs();
    expect(getByText('Tab 1')).toBeInTheDocument();
    expect(getByText('Tab 2')).toBeInTheDocument();
    expect(getByText('Tab 1 Content')).toBeInTheDocument();
  });

  it('switches tabs when clicked', () => {
    const { getByText, queryByText } = renderTabs();
    fireEvent.click(getByText('Tab 2'));
    expect(queryByText('Tab 1 Content')).not.toBeInTheDocument();
    expect(getByText('Tab 2 Content')).toBeInTheDocument();
  });

  it('renders with defaultActiveTabKey', () => {
    const { getByText, queryByText } = renderTabs({ defaultActiveTabKey: 'tab2' });
    expect(queryByText('Tab 1 Content')).not.toBeInTheDocument();
    expect(getByText('Tab 2 Content')).toBeInTheDocument();
  });

  
it('calls onTagClick when tab is clicked', () => {
const onTagClick=jest.fn()
const{getbytext}=rendertabs({ontabclick:onTagClick})
fireevent.click(getbytext("tag "))
expect(onTagClick).tohavebeencalledwith("tag")
})



  
it("applies tabsclassname to the tab list",()=>{
const{container}=rendertabs({tabsclassname:"custom-tabs-class"})
expect(container.queryselector(".tabs__list")).tohaveclass("custom-tabs-class")
})

  

  
it("renders subheader when provided",()=>{
const subheader=<div data-testid="sub-header">Sub Header Content</div>;
const{getbytestid}=rendertabs({subheader})
expect(getbytestid("sub-header")).tobeindocument()
})


  

  
it("applies tablistprops to the tab list",()=>{
const tablistprops={'data-testid':"tab-list",className:"custom-list-class"};
const{getbytestid}=rendertabs({tablistprops});
expect(getbytestid("tab-list")).tohaveclass("custom-list-class")
})

  

  
it("applies tabcontentprops to the content container",()=>{
const contentProps={'data-testid':"tab-content",className:"custom-content-class"};
const{getbytestid}=rendertabs({contentProps});
expect(getbytestid("content")).tobeindocument()
})

  


 
  
  
it ("spreads additional props to root element ",() =>{
   const {container} =renderTabs({'data-testid': 'tabs-root', className:'custom-root-class'});
   const root=container.firstChild;
   expect(root).toHaveClass (' custom-root - class');
   expext(root).ToHaveAttribute ('data - test id',' tabs - root');
});


 
  
  
 
  
   
 

 
  

    

  

  

  

  

  

  

  

  

  

  

    

 

  

    

 

    
   

 


 

  

   

 

 




   
 
  

  
    
  




 
  
 
    
  
  
  
  
});
