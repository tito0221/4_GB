/*
In those tests need to validate the redirections, locators, required/optional fields. 

The hungarian names are the revers of the german names for example. So my official name is Bognár Kristóf (surname, given name). 
Thats why if I would like create an account I would use the Bognár for the #firstName. 
*/

// @ts-check
import {test, expect} from '@playwright/test';

/*
1.TEST In this test I check flow at the inputs of the valid names - submit click - redirection were working.
*/

test('Valid_firstname_lastname', async({page}) => {
 await page.goto('https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp');

 await page.locator('#firstName').fill('Bognár');
 
 await page.locator('#lastName').fill('Kristóf');

 await page.getByRole('button').click();

 const textWritten = await page.locator("(//span[normalize-space()='Basic information'])[1]");
 await expect(textWritten).toHaveText('Basic information');
});



/*
2.TEST In this case we validate that the second input field is optional, so the user doesn't have to fill out that input.
*/

test('Valid_firstname_NULL_lastname', async({page}) => {
  await page.goto('https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp');
   
  await page.locator('#firstName').fill('Bognár');
  
  await page.locator('#lastName').fill('');  

  const lastNameInput = await page.locator('#lastName').inputValue();
  expect(lastNameInput).toBe('');  

  const isLastNameTrue = Boolean(lastNameInput); 
  expect(isLastNameTrue).toBe(false);
});


/*
3.TEST In this case we validate the special characters which are not allowed to use and then error message appears. If the user gives a not validated inputs like '%/=' '-.?' then error message appears under the input boxes
with an exclamation mark after clicking on Submit.  
*/

test('Valid_special_characters', async({page}) => {
    await page.goto('https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp');
     
    await page.locator('#firstName').fill('%/=');
    
    await page.locator('#lastName').fill('-.?');  

    await page.getByRole('button').click();

    await page.waitForTimeout(1000);

    const exclamationMark = await page.locator("//div[@class='jEOsLc']//*[name()='svg']");
    expect(exclamationMark).toBeVisible();  
  
  });