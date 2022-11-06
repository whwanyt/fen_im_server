export interface ResponseParams {
  code?: number;
  message?: string;
  data?: any;
  error?: any;
}
const ResponseUtil = (params: ResponseParams) => {
  params.code = params.code || 200;
  params.message = params.message || 'ok';
  return params;
};
export default ResponseUtil;
