# আবেদনপত্র প্রস্তুতকারক

এই folder-টি আবেদনপত্র প্রস্তুতকারক PWA-এর জন্য নির্ধারিত। Repository-তে থাকা অন্যান্য অ্যাপ বা root-level legacy files এই app-এর অংশ হিসেবে ধরে পরিবর্তন করা যাবে না।

## পরিকল্পিত কাঠামো

```text
apps/application-writer/
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
├── public/
├── server/
└── README.md
```

## Phase 1 নীতি

- সাধারণ ব্যবহারকারীর জন্য login ছাড়া ব্যবহার
- saved application ডিভাইসেই রাখা
- ব্যক্তিগত form data server-এ পাঠানো হবে না
- anonymous activity tracking কেবল প্রয়োজনীয় metrics-এর জন্য
- admin access আলাদা secure session-এর মাধ্যমে
- পুরোনো root-level files সরানোর আগে build verification আবশ্যক

## Migration rule

প্রথমে source files নতুন app directory-তে আনা হবে, তারপর import path, build এবং type-check যাচাই করা হবে। পুরোনো root-level files সরানো হবে না; আলাদা cleanup change হিসেবে করা হবে।
