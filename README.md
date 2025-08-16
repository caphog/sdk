# @caphog/sdk

Analytics for your Capacitor app

## Install

```bash
npm install @caphog/sdk
npx cap sync
```

## API

<docgen-index>

* [`initialize(...)`](#initialize)
* [`logEvent(...)`](#logevent)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### initialize(...)

```typescript
initialize(config: { projectId: string; }) => Promise<void>
```

| Param        | Type                                |
| ------------ | ----------------------------------- |
| **`config`** | <code>{ projectId: string; }</code> |

--------------------


### logEvent(...)

```typescript
logEvent(data: { eventName: string; payload?: Record<string, any>; }) => Promise<void>
```

| Param      | Type                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------- |
| **`data`** | <code>{ eventName: string; payload?: <a href="#record">Record</a>&lt;string, any&gt;; }</code> |

--------------------


### Type Aliases


#### Record

Construct a type with a set of properties K of type T

<code>{ [P in K]: T; }</code>

</docgen-api>
