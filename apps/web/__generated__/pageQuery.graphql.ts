/**
 * @generated SignedSource<<311c920279cf76cb56f392922c08eea7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type pageQuery$variables = Record<PropertyKey, never>;
export type pageQuery$data = {
  readonly viewer: {
    readonly email: string;
    readonly id: string;
    readonly name: string | null | undefined;
  } | null | undefined;
};
export type pageQuery = {
  response: pageQuery$data;
  variables: pageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "viewer",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "email",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "pageQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "6d066ddb9b911fe42a76e6c750b11a73",
    "id": null,
    "metadata": {},
    "name": "pageQuery",
    "operationKind": "query",
    "text": "query pageQuery {\n  viewer {\n    id\n    email\n    name\n  }\n}\n"
  }
};
})();

(node as any).hash = "5622962582b5d160f1de68f12af9bfe9";

export default node;
