module.exports = `
type Query {
    getNote(params: noteParams): [Note],
    getRecord(params: recordParams): [Record],
    getTargetRecord(params: targetRecordParams): [TargetRecord]
}
`