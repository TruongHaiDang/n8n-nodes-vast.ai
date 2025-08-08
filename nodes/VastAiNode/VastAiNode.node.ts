/* eslint-disable n8n-nodes-base/node-param-resource-with-plural-option */
import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ILoadOptionsFunctions,
	IHttpRequestOptions,
	IHttpRequestMethods
} from 'n8n-workflow';

import { attachSSHKeyParams } from './Instances/AttachSSHKey';
import { cancelCopyParams } from './Instances/CancelCopy';
import { copyParams } from './Instances/Copy';
import { cancelSyncParams } from './Instances/CancelSync';
import { createInstanceParams } from './Instances/CreateInstance';
import { destroyInstanceParams } from './Instances/DestroyInstance';
import { showInstanceParams } from './Instances/ShowInstance';
import { searchOffersParams } from './Search/SearchOffers';

interface ApiEndpoint {
	endpoint: string;
	method: IHttpRequestMethods;
}
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class VastAiNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Vast AI',
		name: 'vastAiNode',
		group: ['vast.ai'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Get all informations of an account.',
		defaults: {
			name: 'Accounts',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'vastAICredentialsApi', // phải khớp với `name` trong file credentials
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Accounts', value: 'accounts' },
					// { name: 'Billing', value: 'billing' },
					{ name: 'Instances', value: 'instances' },
					// { name: 'Machines', value: 'machines' },
					{ name: 'Search', value: 'search' },
					{ name: 'Serverless', value: 'serverless' },
					// { name: 'Team', value: 'team' },
					// { name: 'Template', value: 'template' },
					{ name: 'Volumes', value: 'volumes' },
				],
				default: 'accounts',
				description: 'Select resource',
			},
			{
				displayName: 'API Group Name or ID',
				name: 'api',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getApis',
				},
				default: '',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				description: 'Body of the request. Blank if the method is GET.',
				options: [
					{
						displayName: 'Body',
						name: 'body',
						values: [
							{
								displayName: 'Parameter Name or ID',
								name: 'key',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getApiParams',
								},
								description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						]
					}
				]
			}
		],
	};
	methods = {
		loadOptions: {
			async getApis(this: ILoadOptionsFunctions) {
				const resource = this.getCurrentNodeParameter('resource');
				switch(resource) {
					case 'instances':
						return [
							{ name: 'Attach SSH Key', value: 'attach_ssh_key_post' },
							{ name: 'Cancel Copy', value: 'cancel_copy_delete' },
							{ name: 'Cancel Sync', value: 'cancel_sync_delete' },
							// { name: 'Change Bid', value: 'change_bid_put' },
							// { name: 'Cloud Copy', value: 'cloud_copy_post' },
							{ name: 'Copy', value: 'copy_put' },
							{ name: 'Create Instance', value: 'create_instance_put' },
							{ name: 'Destroy Instance', value: 'destroy_instance_delete' },
							// { name: 'Detach SSH Key', value: 'detach_ssh_key_delete' },
							// { name: 'Execute', value: 'execute_put' },
							// { name: 'Manage Instance', value: 'manage_instance_put' },
							// { name: 'Prepay Instance', value: 'prepay_instance_put' },
							// { name: 'Reboot Instance', value: 'reboot_instance_put' },
							// { name: 'Recycle Instance', value: 'recycle_instance_put' },
							{ name: 'Show Instance', value: 'show_instance_get' },
							{ name: 'Show Instances', value: 'show_instances_get' },
							// { name: 'Show Logs', value: 'show_logs_put' },
							// { name: 'Show SSH Keys', value: 'show_ssh_keys_get' },
						];
					case 'machines':
						return [
							// { name: 'Cancel Maint', value: 'cancel_maint_put' },
							// { name: 'Cleanup Machine', value: 'cleanup_machine_put' },
							// { name: 'List Machine', value: 'list_machine_put' },
							// { name: 'Remove Defjob', value: 'remove_defjob_delete' },
							// { name: 'Schedule Maint', value: 'schedule_maint_put' },
							// { name: 'Set Defjob', value: 'set_defjob_put' },
							// { name: 'Set Min Bid', value: 'set_min_bid_put' },
							// { name: 'Show Machines', value: 'show_machines_get' },
							// { name: 'Show Reports', value: 'show_reports_get' },
							// { name: 'Unlist Machine', value: 'unlist_machine_delete' },
						];
					case 'accounts':
						return [
							// { name: 'Create API Key', value: 'create_api_key_post' },
							// { name: 'Create Env Var', value: 'create_env_var_post' },
							// { name: 'Create SSH Key', value: 'create_ssh_key_post' },
							// { name: 'Create Subaccount', value: 'create_subaccount_post' },
							// { name: 'Delete API Key', value: 'delete_api_key_delete' },
							// { name: 'Delete Env Var', value: 'delete_env_var_delete' },
							// { name: 'Delete SSH Key', value: 'delete_ssh_key_delete' },
							// { name: 'Reset API Key', value: 'reset_api_key_put' },
							// { name: 'Set User', value: 'set_user_put' },
							{ name: 'Show API Keys', value: 'show_api_keys_get' },
							// { name: 'Show API Key', value: 'show_api_key_get' },
							{ name: 'Show Connections', value: 'show_connections_get' },
							{ name: 'Show Env Vars', value: 'show_env_vars_get' },
							// { name: 'Show Ipaddrs', value: 'show_ipaddrs_get' },
							// { name: 'Show SSH Keys', value: 'show_ssh_keys_get' },
							{ name: 'Show Subaccounts', value: 'show_subaccounts_get' },
							// { name: 'Show Team Role', value: 'show_team_role_get' },
							{ name: 'Show User', value: 'show_user_get' },
							// { name: 'Transfer Credit', value: 'transfer_credit_put' },
							// { name: 'Update Env Var', value: 'update_env_var_put' },
							// { name: 'Update SSH Key', value: 'update_ssh_key_put' },
						];
					case 'serverless':
						return [
							// { name: 'Create Autogroup', value: 'create_autogroup_post' },
							// { name: 'Create Endpoint', value: 'create_endpoint_post' },
							// { name: 'Delete Autogroup', value: 'delete_autogroup_delete' },
							// { name: 'Delete Endpoint', value: 'delete_endpoint_delete' },
							// { name: 'Get Autogroup Logs', value: 'get_autogroup_logs_post' },
							// { name: 'Get Autogroup Workers', value: 'get_autogroup_workers_post' },
							// { name: 'Get Endpoint Logs', value: 'get_endpoint_logs_post' },
							// { name: 'Get Endpoint Workers', value: 'get_endpoint_workers_post' },
							// { name: 'Route', value: 'route_post' },
							{ name: 'Show Autogroup', value: 'show_autogroup_get' },
							{ name: 'Show Endpoints', value: 'show_endpoints_get' },
							// { name: 'Update Autogroup', value: 'update_autogroup_put' },
							// { name: 'Update Endpoint', value: 'update_endpoint_put' },
						];
					case 'team':
						return [
							// { name: 'Create Team', value: 'create_team_post' },
							// { name: 'Create Team Role', value: 'create_team_role_post' },
							// { name: 'Destroy Team', value: 'destroy_team_delete' },
							// { name: 'Invite Team Member', value: 'invite_team_member_post' },
							// { name: 'Remove Team Member', value: 'remove_team_member_delete' },
							// { name: 'Remove Team Role', value: 'remove_team_role_delete' },
							{ name: 'Show Team Members', value: 'show_team_members_get' },
							{ name: 'Show Team Roles', value: 'show_team_roles_get' },
							// { name: 'Update Team Role', value: 'update_team_role_put' },
						];
					case 'template':
						return [
							// { name: 'Update Template', value: 'update_template_post' },
						];
					case 'search':
						return [
							// { name: 'Search Benchmarks', value: 'search_benchmarks_get' },
							{ name: 'Search Offers', value: 'search_offers_put' },
							// { name: 'Search Templates', value: 'search_templates_get' },
						];
					case 'volumes':
						return [
							// { name: 'Delete Volume', value: 'delete_volume_delete' },
							{ name: 'List Volumes', value: 'list_volumes_get' },
							// { name: 'Rent Volume', value: 'rent_volume_put' },
							// { name: 'Search Volumes', value: 'search_volumes_post' },
							// { name: 'Unlist Volume', value: 'unlist_volume_post' },
						];
					case 'billing':
						return [
							// { name: 'Search Invoices', value: 'search_invoices_get' },
							// { name: 'Show Deposit', value: 'show_deposit_get' },
							// { name: 'Show Earnings', value: 'show_earnings_get' },
							// { name: 'Show Invoice', value: 'show_invoice_get' },
						];
					default:
						return [];
				}
			},
			async getApiParams(this: ILoadOptionsFunctions) {
				const api = this.getCurrentNodeParameter('api');
				switch (api) {
					// Instances cases
					case 'attach_ssh_key_post':
						return attachSSHKeyParams;
					case 'cancel_copy_delete':
						return cancelCopyParams;
					case 'copy_put':
						return copyParams;
					case 'cancel_sync_delete':
						return cancelSyncParams;
					case 'cloud_copy_post':
						return [];
					case 'change_bid_put':
						return [];
					case 'create_instance_put':
						return createInstanceParams;
					case 'destroy_instance_delete':
						return destroyInstanceParams;
					case 'manage_instance_put':
						return [];
					case 'show_instance_get':
						return showInstanceParams;
					case 'detach_ssh_key_delete':
						return [];
					case 'execute_put':
						return [];
					case 'show_logs_put':
						return [];
					case 'prepay_instance_put':
						return [];
					case 'reboot_instance_put':
						return [];
					case 'recycle_instance_put':
						return [];
					case 'show_ssh_keys_get':
						return [];
					case 'show_instances_get':
						return [];

					// Machines cases
					case 'cancel_maint_put':
						return [];
					case 'cleanup_machine_put':
						return [];
					case 'list_machine_put':
						return [];
					case 'remove_defjob_delete':
						return [];
					case 'show_reports_get':
						return [];
					case 'schedule_maint_put':
						return [];
					case 'set_defjob_put':
						return [];
					case 'set_min_bid_put':
						return [];
					case 'show_machines_get':
						return [];
					case 'unlist_machine_delete':
						return [];

					// Accounts cases
					case 'create_api_key_post':
						return [];
					case 'show_api_keys_get':
						return [];
					case 'create_env_var_post':
						return [];
					case 'delete_env_var_delete':
						return [];
					case 'show_env_vars_get':
						return [];
					case 'update_env_var_put':
						return [];
					case 'create_ssh_key_post':
						return [];
					case 'show_ssh_keys_get':
						return [];
					case 'create_subaccount_post':
						return [];
					case 'set_user_put':
						return [];
					case 'delete_api_key_delete':
						return [];
					case 'show_api_key_get':
						return [];
					case 'delete_ssh_key_delete':
						return [];
					case 'update_ssh_key_put':
						return [];
					case 'reset_api_key_put':
						return [];
					case 'show_connections_get':
						return [];
					case 'show_ipaddrs_get':
						return [];
					case 'show_subaccounts_get':
						return [];
					case 'show_team_role_get':
						return [];
					case 'show_user_get':
						return [];
					case 'transfer_credit_put':
						return [];

					// Serverless cases
					case 'create_autogroup_post':
						return [];
					case 'show_autogroup_get':
						return [];
					case 'create_endpoint_post':
						return [];
					case 'show_endpoints_get':
						return [];
					case 'delete_autogroup_delete':
						return [];
					case 'update_autogroup_put':
						return [];
					case 'delete_endpoint_delete':
						return [];
					case 'update_endpoint_put':
						return [];
					case 'get_autogroup_logs_post':
						return [];
					case 'get_autogroup_workers_post':
						return [];
					case 'get_endpoint_logs_post':
						return [];
					case 'get_endpoint_workers_post':
						return [];
					case 'route_post':
						return [];

					// Team cases
					case 'create_team_post':
						return [];
					case 'create_team_role_post':
						return [];
					case 'destroy_team_delete':
						return [];
					case 'invite_team_member_post':
						return [];
					case 'remove_team_member_delete':
						return [];
					case 'remove_team_role_delete':
						return [];
					case 'show_team_members_get':
						return [];
					case 'update_team_role_put':
						return [];
					case 'show_team_roles_get':
						return [];

					// Template cases
					case 'update_template_post':
						return [];

					// Search cases
					case 'search_templates_get':
						return [];
					case 'search_benchmarks_get':
						return [];
					case 'search_offers_put':
						return searchOffersParams;

					// Volumes cases
					case 'delete_volume_delete':
						return [];
					case 'rent_volume_put':
						return [];
					case 'list_volumes_get':
						return [];
					case 'search_volumes_post':
						return [];
					case 'unlist_volume_post':
						return [];

					// Billing cases
					case 'search_invoices_get':
						return [];
					case 'show_deposit_get':
						return [];
					case 'show_earnings_get':
						return [];
					case 'show_invoice_get':
						return [];

					default:
						return [];
				}
			}
		}
	}

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const endPoint: string = "https://console.vast.ai/api/v0";
		const apisMap: Record<string, ApiEndpoint> = {
			// Accounts
			"create_api_key_post": { endpoint: "", method: "POST" },
			"create_env_var_post": { endpoint: "", method: "POST" },
			"create_ssh_key_post": { endpoint: "", method: "POST" },
			"create_subaccount_post": { endpoint: "", method: "POST" },
			"delete_api_key_delete": { endpoint: "", method: "DELETE" },
			"delete_env_var_delete": { endpoint: "", method: "DELETE" },
			"delete_ssh_key_delete": { endpoint: "", method: "DELETE" },
			"reset_api_key_put": { endpoint: "", method: "PUT" },
			"set_user_put": { endpoint: "", method: "PUT" },
			"show_api_key_get": { endpoint: "", method: "GET" },
			"show_api_keys_get": { endpoint: "/auth/apikeys/", method: "GET" },
			"show_connections_get": { endpoint: "/users/cloud_integrations/", method: "GET" },
			"show_env_vars_get": { endpoint: "/secrets/", method: "GET" },
			"show_ipaddrs_get": { endpoint: "", method: "GET" },
			"show_ssh_keys_get": { endpoint: "", method: "GET" },
			"show_subaccounts_get": { endpoint: "/subaccounts/", method: "GET" },
			"show_team_role_get": { endpoint: "", method: "GET" },
			"show_user_get": { endpoint: "/users/current/", method: "GET" },
			"transfer_credit_put": { endpoint: "", method: "PUT" },
			"update_env_var_put": { endpoint: "", method: "PUT" },
			"update_ssh_key_put": { endpoint: "", method: "PUT" },

			// Billing
			"search_invoices_get": { endpoint: "", method: "GET" },
			"show_deposit_get": { endpoint: "", method: "GET" },
			"show_earnings_get": { endpoint: "", method: "GET" },
			"show_invoice_get": { endpoint: "", method: "GET" },

			// Instances
			"attach_ssh_key_post": { endpoint: "/instances/{id}/ssh/", method: "POST" },
			"cancel_copy_delete": { endpoint: "/commands/copy_direct/", method: "DELETE" },
			"cancel_sync_delete": { endpoint: "/commands/rclone/", method: "DELETE" },
			"change_bid_put": { endpoint: "", method: "PUT" },
			"cloud_copy_post": { endpoint: "", method: "POST" },
			"copy_put": { endpoint: "/commands/copy_direct/", method: "PUT" },
			"create_instance_put": { endpoint: "/asks/{id}/", method: "PUT" },
			"destroy_instance_delete": { endpoint: "/instances/{id}/", method: "DELETE" },
			"detach_ssh_key_delete": { endpoint: "", method: "DELETE" },
			"execute_put": { endpoint: "", method: "PUT" },
			"manage_instance_put": { endpoint: "", method: "PUT" },
			"prepay_instance_put": { endpoint: "", method: "PUT" },
			"reboot_instance_put": { endpoint: "", method: "PUT" },
			"recycle_instance_put": { endpoint: "", method: "PUT" },
			"show_instance_get": { endpoint: "/instances/{id}/", method: "GET" },
			"show_instances_get": { endpoint: "/instances/", method: "GET" },
			"show_logs_put": { endpoint: "", method: "PUT" },

			// Machines
			"cancel_maint_put": { endpoint: "", method: "PUT" },
			"cleanup_machine_put": { endpoint: "", method: "PUT" },
			"list_machine_put": { endpoint: "", method: "PUT" },
			"remove_defjob_delete": { endpoint: "", method: "DELETE" },
			"schedule_maint_put": { endpoint: "", method: "PUT" },
			"set_defjob_put": { endpoint: "", method: "PUT" },
			"set_min_bid_put": { endpoint: "", method: "PUT" },
			"show_machines_get": { endpoint: "", method: "GET" },
			"show_reports_get": { endpoint: "", method: "GET" },
			"unlist_machine_delete": { endpoint: "", method: "DELETE" },

			// Search
			"search_benchmarks_get": { endpoint: "", method: "GET" },
			"search_offers_put": { endpoint: "/search/asks/", method: "PUT" },
			"search_templates_get": { endpoint: "", method: "GET" },

			// Serverless
			"create_autogroup_post": { endpoint: "", method: "POST" },
			"create_endpoint_post": { endpoint: "", method: "POST" },
			"delete_autogroup_delete": { endpoint: "", method: "DELETE" },
			"delete_endpoint_delete": { endpoint: "", method: "DELETE" },
			"get_autogroup_logs_post": { endpoint: "", method: "POST" },
			"get_autogroup_workers_post": { endpoint: "", method: "POST" },
			"get_endpoint_logs_post": { endpoint: "", method: "POST" },
			"get_endpoint_workers_post": { endpoint: "", method: "POST" },
			"route_post": { endpoint: "", method: "POST" },
			"show_autogroup_get": { endpoint: "/autojobs/", method: "GET" },
			"show_endpoints_get": { endpoint: "/endptjobs/", method: "GET" },
			"update_autogroup_put": { endpoint: "", method: "PUT" },
			"update_endpoint_put": { endpoint: "", method: "PUT" },

			// Template
			"update_template_post": { endpoint: "", method: "POST" },

			// Volumes
			"delete_volume_delete": { endpoint: "", method: "DELETE" },
			"list_volumes_get": { endpoint: "/volumes/", method: "GET" },
			"rent_volume_put": { endpoint: "", method: "PUT" },
			"search_volumes_post": { endpoint: "", method: "POST" },
			"unlist_volume_post": { endpoint: "", method: "POST" }
		}

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Iterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const selectedApi = this.getNodeParameter('api', itemIndex) as string;
				const apiConfig = apisMap[selectedApi];
				let url: string = `${endPoint}${apiConfig.endpoint}`;
				let method: IHttpRequestMethods = apiConfig.method;

				// Trích xuất các param đã nhập trong phần Body
				let rawBodyParams: Array<{ key: string; value: any }> = [];
				const requestBody: Record<string, any> = {};
				if (method !== 'GET') {
					rawBodyParams = this.getNodeParameter('body.body', itemIndex, []) as Array<{ key: string; value: any }>;

					for (const entry of rawBodyParams) {
						if (entry.key !== '') {
							requestBody[entry.key] = entry.value;
						}
					};
				};

				// Lấy credentials đã được mã hóa
				const credentials = await this.getCredentials('vastAICredentialsApi');

				// Tùy chọn cho yêu cầu HTTP
				const requestOptions: IHttpRequestOptions = {
					method: method,
					url: url,
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${credentials.apiKey}`,
					},
					json: true,
				};

				// Nếu là search_offers thì cần bọc vào "q"
				switch (selectedApi) {
					case 'search_offers_put':
						{
							requestOptions.body = { q: requestBody };
							break;
						}
					case 'create_instance_put':
						{
							let id = requestBody.id;
							if (id == null || id === '') {
								throw new NodeOperationError(this.getNode(), 'Missing required path parameter: id', { itemIndex });
							}
							requestOptions.url = requestOptions.url.replace('{id}', encodeURIComponent(String(id)));
							const { id: _, ...rest } = requestBody; // loại id khỏi body
							requestOptions.body = rest;
							break;
						}
					case 'destroy_instance_delete':
						{
							let id = requestBody.id;
							if (id == null || id === '') {
								throw new NodeOperationError(this.getNode(), 'Missing required path parameter: id', { itemIndex });
							}
							requestOptions.url = requestOptions.url.replace('{id}', encodeURIComponent(String(id)));
							break;
						}
					case 'show_instance_get':
						{
							let id = requestBody.id;
							if (id == null || id === '') {
								throw new NodeOperationError(this.getNode(), 'Missing required path parameter: id', { itemIndex });
							}
							requestOptions.url = requestOptions.url.replace('{id}', encodeURIComponent(String(id)));
							break;
						}
					case 'attach_ssh_key_post':
						{
							let id = requestBody.id;
							if (id == null || id === '') {
								throw new NodeOperationError(this.getNode(), 'Missing required path parameter: id', { itemIndex });
							}
							requestOptions.url = requestOptions.url.replace('{id}', encodeURIComponent(String(id)));
							const { id: _, ...rest } = requestBody; // loại id khỏi body
							requestOptions.body = rest;
							break;
						}
					default:
						{
							requestOptions.body = requestBody;
							break;
						}
				}

				// Gọi API bằng httpRequest của n8n
				const response = (await this.helpers.httpRequest.call(this, requestOptions)) as any;

				returnData.push({
					json: response,
				});
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [returnData];
	}
}
