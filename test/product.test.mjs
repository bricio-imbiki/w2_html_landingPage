import { JSDOM } from 'jsdom';
import { expect, assert } from 'chai'; // Import `expect` and `assert` from chai
import chaiDom from 'chai-dom';
import fs from 'fs';

// Register chai-dom with chai
import chai from 'chai';
chai.use(chaiDom);

// Import the HTML file
const htmlContent = fs.readFileSync('./index.html', 'utf-8');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Setup the DOM for testing
let document;
let totalTests = 0;
let passedTests = 0;

before(() => {
  const dom = new JSDOM(htmlContent);
  document = dom.window.document;
});

// Helper functions
const attrsChecker = (elem, attributes) => {
  attributes.forEach(attr => {
    totalTests++;
    const value = elem.getAttribute(attr);
    try {
      assert.isNotNull(value, `Element <${elem.tagName}> should have attribute '${attr}'`);
      assert.isNotEmpty(value, `Attribute '${attr}' should not be empty`);
      passedTests++;
    } catch (error) {
      console.error(`Failed for <${elem.tagName}> with attribute '${attr}': ${error.message}`);
    }
  });
};

const checkContainer = (elem) => {
  totalTests++;
  try {
    assert.isNotEmpty(elem.children, `<${elem.tagName}> should have child elements`);
    passedTests++;
  } catch (error) {
    console.error(error.message);
  }
};

describe('Product Landing Page Tests', () => {
  it('Validate header elements', () => {
    const header = document.querySelector('header');
    checkContainer(header);
    attrsChecker(header, ['id']);
  });

  it('Validate nav-bar', () => {
    const navBar = document.querySelector('#nav-bar');
    checkContainer(navBar);
    attrsChecker(navBar, ['id']);
    const navLinks = navBar.querySelectorAll('a');
    navLinks.forEach(link => attrsChecker(link, ['href', 'class']));
  });

  it('Validate img elements in header', () => {
    const img = document.querySelector('#header-img');
    attrsChecker(img, ['id', 'src', 'alt']);
  });

  it('Validate form elements', () => {
    const form = document.querySelector('#form');
    attrsChecker(form, ['id', 'action']);
    checkContainer(form);

    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      attrsChecker(input, ['id', 'type', 'name', 'placeholder']);
    });
  });

  it('Validate sections and containers', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      attrsChecker(section, ['id']);
      checkContainer(section);
    });
  });

  it('Validate product elements', () => {
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
      attrsChecker(product, ['id']);
      checkContainer(product);

      const h2 = product.querySelector('h2');
      attrsChecker(h2, ['id']);
      const ol = product.querySelector('ol');
      attrsChecker(ol, ['id']);
      const button = product.querySelector('button');
      attrsChecker(button, ['class']);
    });
  });

  it('Validate footer elements', () => {
    const footer = document.querySelector('footer');
    checkContainer(footer);
    const footerLinks = footer.querySelectorAll('a');
    footerLinks.forEach(link => attrsChecker(link, ['href']));
  });

  after(() => {
    const successRate = ((passedTests / totalTests) * 100).toFixed(2);
    console.log(`Tests executed: ${totalTests}`);
    console.log(`Tests passed: ${passedTests}`);
    console.log(`Success rate: ${successRate}%`);
  });
});
