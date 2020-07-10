// 创建Product对象的不同部分的方法
interface Builder {
    producePartA(): void;
    producePartB(): void;
    producePartC(): void;
}

// 构建具体的实现
class ConcreteBuilderA implements Builder {
    private product: ProductA;

    constructor() {
        this.reset();
    }

    // 一个新的构建器实例应该包含一个空白的Product，用于进一步的组装
    public reset() {
        this.product = new ProductA();
    }

    public producePartA(): void {
        this.product.parts.push('PartA1');
    }

    public producePartB(): void {
        this.product.parts.push('PartB1');
    }

    public producePartC(): void {
        this.product.parts.push('PartC1');
    }

    // ConcreteBuilder 实现自己特有的方法，
    public getProduct(): ProductA{
        const result = this.product;
        this.reset();
        return result
    }

}

class ProductA {
    public parts: string[] = [];

    public listParts(): void {
        console.log(`Product parts: ${this.parts.join(', ')}\n`)
    }
}

// Director仅负责Builder方法的执行顺序
class Director {
    public builder: Builder;

    public setBuilder(builder: Builder) {
        this.builder = builder;
    }

    public buildMinimalViableProduct() {
        this.builder.producePartA();
    }

    public buildFullFeaturedProduct() {
        this.builder.producePartA();
        this.builder.producePartB();
        this.builder.producePartC();
    }
}


function clientCode(director: Director) {
    const builder = new ConcreteBuilderA();
    director.setBuilder(builder);

    console.log('Standard basic product:');
    director.buildMinimalViableProduct();
    builder.getProduct().listParts();

    console.log('Standard full featured product:');
    director.buildFullFeaturedProduct();
    builder.getProduct().listParts();

    console.log('Custom product:');
    builder.producePartA();
    builder.producePartC();
    builder.getProduct().listParts();
}

let director = new Director();
clientCode(director);


// Standard basic product:
//     Product parts: PartA1
//
// Standard full featured product:
//     Product parts: PartA1, PartB1, PartC1
//
// Custom product:
//     Product parts: PartA1, PartC1
