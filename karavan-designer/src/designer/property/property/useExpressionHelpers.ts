/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { useMemo } from 'react';
import { CamelDefinitionApiExt } from 'karavan-core/lib/api/CamelDefinitionApiExt';
import { Languages } from 'karavan-core/lib/model/CamelMetadata';
import { CamelElement } from 'karavan-core/lib/model/IntegrationDefinition';

/**
 * Хук для получения className выражения из ExpressionDefinition
 */
export function useExpressionClassName(expressionDefinition: CamelElement): string {
    return useMemo(
        () => CamelDefinitionApiExt.getExpressionLanguageClassName(expressionDefinition) || 'GroovyExpression',
        [expressionDefinition],
    );
}

/**
 * Хук для получения объекта языка из списка Languages по имени
 */
export function useDslLanguage(languageName: string): [string, string, string] | undefined {
    return useMemo(() => Languages.find((l: [string, string, string]) => l[0] === languageName), [languageName]);
}
