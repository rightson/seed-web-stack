/**
 * @generated SignedSource<<c8c867fc037c0f11104808c28a0f902e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type pageRegisterMutation$variables = {
  email: string;
  name?: string | null | undefined;
  password: string;
};
export type pageRegisterMutation$data = {
  readonly register: {
    readonly token: string;
    readonly user: {
      readonly email: string;
      readonly id: string;
      readonly name: string | null | undefined;
    };
  };
};
export type pageRegisterMutation = {
  response: pageRegisterMutation$data;
  variables: pageRegisterMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "email"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "password"
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      },
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      },
      {
        "kind": "Variable",
        "name": "password",
        "variableName": "password"
      }
    ],
    "concreteType": "AuthPayload",
    "kind": "LinkedField",
    "name": "register",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "token",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
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
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageRegisterMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "pageRegisterMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "27600c69186809156237b6b71a385ce9",
    "id": null,
    "metadata": {},
    "name": "pageRegisterMutation",
    "operationKind": "mutation",
    "text": "mutation pageRegisterMutation(\n  $email: String!\n  $password: String!\n  $name: String\n) {\n  register(email: $email, password: $password, name: $name) {\n    token\n    user {\n      id\n      email\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f0e50b0a1aba0d42c1f6cd4ba0c5d54c";

export default node;
