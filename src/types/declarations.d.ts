/// <reference types="expo/types" />

// Allow CSS side-effect and default imports (web)
declare module '*.css' {
  const content: any;
  export default content;
}

// Support for CSS Modules (web components)
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

